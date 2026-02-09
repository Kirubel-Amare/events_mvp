import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Plan, PlanStatus } from '../models/Plan';
import { Application } from '../models/Application';
import { AuthRequest } from '../middleware/auth';
import { Like, MoreThanOrEqual, LessThanOrEqual, Between, FindOptionsWhere } from 'typeorm';

const planRepository = AppDataSource.getRepository(Plan);
const applicationRepository = AppDataSource.getRepository(Application);

export const getAllPlans = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { city, dateFrom, dateTo, search } = req.query;

    const where: FindOptionsWhere<Plan> = {
      status: PlanStatus.ACTIVE,
    };

    if (city) {
      where.location = Like(`%${city}%`);
    }

    if (dateFrom && dateTo) {
      where.date = Between(new Date(dateFrom as string), new Date(dateTo as string));
    } else if (dateFrom) {
      where.date = MoreThanOrEqual(new Date(dateFrom as string));
    } else if (dateTo) {
      where.date = LessThanOrEqual(new Date(dateTo as string));
    }

    if (search) {
      where.title = Like(`%${search}%`);
    }

    const [plans, total] = await planRepository.findAndCount({
      where,
      relations: ['creator', 'creator.personalProfile'],
      order: { date: 'ASC' },
      skip,
      take: limit,
    });

    return res.json({
      plans,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get all plans error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPlanById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const plan = await planRepository.findOne({
      where: { id },
      relations: ['creator', 'creator.personalProfile'],
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    return res.json(plan);
  } catch (error) {
    console.error('Get plan by id error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPlan = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { title, description, location, date, externalLink } = req.body;

    const plan = new Plan();
    plan.title = title;
    plan.description = description;
    plan.location = location;
    plan.date = new Date(date);
    plan.externalLink = externalLink;
    plan.creatorId = userId;
    plan.status = PlanStatus.ACTIVE;

    await planRepository.save(plan);

    return res.status(201).json({ message: 'Plan created', plan });
  } catch (error) {
    console.error('Create plan error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const plan = await planRepository.findOne({
      where: { id },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    if (plan.creatorId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { title, description, location, date, externalLink, status } = req.body;

    if (title) plan.title = title;
    if (description) plan.description = description;
    if (location) plan.location = location;
    if (date) plan.date = new Date(date);
    if (externalLink !== undefined) plan.externalLink = externalLink;
    if (status) plan.status = status;

    await planRepository.save(plan);

    return res.json({ message: 'Plan updated', plan });
  } catch (error) {
    console.error('Update plan error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const isAdmin = req.user?.isAdmin;

    const plan = await planRepository.findOne({
      where: { id },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    if (!isAdmin && plan.creatorId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await planRepository.remove(plan);

    return res.json({ message: 'Plan deleted' });
  } catch (error) {
    console.error('Delete plan error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const applyToPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // Plan ID
    const userId = req.user!.id;
    const { message } = req.body;

    const plan = await planRepository.findOne({ where: { id } });
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    if (plan.status !== PlanStatus.ACTIVE) {
      return res.status(400).json({ error: 'Plan is not active' });
    }

    if (plan.creatorId === userId) {
      return res.status(400).json({ error: 'Cannot join your own plan' });
    }

    const existingApplication = await applicationRepository.findOne({
      where: { userId, planId: id },
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied to this plan' });
    }

    const application = new Application();
    application.userId = userId;
    application.planId = id;
    application.message = message;

    await applicationRepository.save(application);

    return res.status(201).json({ message: 'Applied to plan', application });
  } catch (error) {
    console.error('Apply to plan error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const cancelPlanApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // Plan ID
    const userId = req.user!.id;

    const application = await applicationRepository.findOne({
      where: { userId, planId: id },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    await applicationRepository.remove(application);

    return res.json({ message: 'Application cancelled' });
  } catch (error) {
    console.error('Cancel plan application error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPlanApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // Plan ID
    const userId = req.user!.id;

    const plan = await planRepository.findOne({
      where: { id },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    if (plan.creatorId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const applications = await applicationRepository.find({
      where: { planId: id },
      relations: ['user', 'user.personalProfile'],
      order: { appliedAt: 'DESC' },
    });

    return res.json(applications);
  } catch (error) {
    console.error('Get plan applications error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};