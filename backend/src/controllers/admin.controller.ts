import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Event, EventStatus } from '../models/Event';
import { OrganizerProfile } from '../models/OrganizerProfile';
import { Report, ReportStatus } from '../models/Report';
import { Category } from '../models/Category';
import { User } from '../models/User';
import { Plan } from '../models/Plan';
import { AuthRequest } from '../middleware/auth';

const eventRepository = AppDataSource.getRepository(Event);
const organizerProfileRepository = AppDataSource.getRepository(OrganizerProfile);
const reportRepository = AppDataSource.getRepository(Report);
const categoryRepository = AppDataSource.getRepository(Category);
const userRepository = AppDataSource.getRepository(User);
const planRepository = AppDataSource.getRepository(Plan);

export const getPendingEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await eventRepository.find({
      where: { status: EventStatus.PENDING },
      relations: ['organizer', 'category'],
      order: { createdAt: 'ASC' },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEventStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const event = await eventRepository.findOne({ where: { id } });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    event.status = status;
    await eventRepository.save(event);

    res.json({ message: 'Event status updated', event });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleEventFeature = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    const event = await eventRepository.findOne({ where: { id } });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    event.isFeatured = isFeatured;
    await eventRepository.save(event);

    res.json({ message: 'Event feature status updated', event });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPendingOrganizers = async (req: AuthRequest, res: Response) => {
  try {
    const organizers = await organizerProfileRepository.find({
      where: { isVerified: false },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
    res.json(organizers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyOrganizer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const organizer = await organizerProfileRepository.findOne({ where: { id } });
    if (!organizer) return res.status(404).json({ error: 'Organizer not found' });

    organizer.isVerified = isVerified;
    if (isVerified) {
      organizer.verifiedAt = new Date();
    } else {
      organizer.verifiedAt = null;
    }
    await organizerProfileRepository.save(organizer);

    res.json({ message: 'Organizer verification updated', organizer });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status) where.status = status;

    const reports = await reportRepository.find({
      where,
      relations: ['reporter'],
      order: { createdAt: 'DESC' },
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateReportStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await reportRepository.findOne({ where: { id } });
    if (!report) return res.status(404).json({ error: 'Report not found' });

    report.status = status;
    if (status === ReportStatus.RESOLVED) {
      report.resolvedAt = new Date();
      report.resolvedBy = req.user?.id || 'admin';
    }
    await reportRepository.save(report);

    res.json({ message: 'Report status updated', report });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await categoryRepository.find({ order: { name: 'ASC' } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, icon } = req.body;
    const category = new Category();
    category.name = name;
    category.icon = icon;
    await categoryRepository.save(category);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, icon, isActive } = req.body;

    const category = await categoryRepository.findOne({ where: { id: parseInt(id) } });
    if (!category) return res.status(404).json({ error: 'Category not found' });

    if (name) category.name = name;
    if (icon !== undefined) category.icon = icon;
    if (isActive !== undefined) category.isActive = isActive;

    await categoryRepository.save(category);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await categoryRepository.delete(id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.query;
    const where: any = {};
    if (role === 'organizer') where.isOrganizer = true;
    if (role === 'admin') where.isAdmin = true;
    // if role === 'user', maybe show all? or just non-organizers?

    const users = await userRepository.find({
      where,
      relations: ['personalProfile'],
      take: 50,
      order: { createdAt: 'DESC' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // 'user', 'organizer', 'admin'

    const user = await userRepository.findOne({ where: { id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Prevent removing own admin status if you are the only one?
    // For MVP, just update.

    if (role === 'admin') user.isAdmin = true;
    else if (role === 'organizer') user.isOrganizer = true;
    else {
      user.isAdmin = false;
      user.isOrganizer = false;
    }

    await userRepository.save(user);
    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await userRepository.count();
    const totalEvents = await eventRepository.count();
    const totalPlans = await planRepository.count();
    const totalReports = await reportRepository.count();

    res.json({ totalUsers, totalEvents, totalPlans, totalReports });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};