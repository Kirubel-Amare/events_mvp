import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Event, EventStatus } from '../models/Event';
import { Plan, PlanStatus } from '../models/Plan';
import { Category } from '../models/Category';
import { AuthRequest } from '../middleware/auth';
import { Like, FindOptionsWhere, MoreThanOrEqual } from 'typeorm';

const eventRepository = AppDataSource.getRepository(Event);
const planRepository = AppDataSource.getRepository(Plan);
const categoryRepository = AppDataSource.getRepository(Category);

export const getFeed = async (req: Request, res: Response) => {
  try {
    const { city, category, type } = req.query; // type: 'event', 'plan', 'all' default

    const limit = 10;
    const now = new Date();

    const response: any = {};

    if (!type || type === 'all' || type === 'event') {
      const eventWhere: FindOptionsWhere<Event> = {
        status: EventStatus.APPROVED,
        date: MoreThanOrEqual(now),
      };

      if (city) eventWhere.city = Like(`%${city}%`);
      if (category) eventWhere.categoryId = parseInt(category as string);

      // Featured Events (Top 5)
      const featuredEvents = await eventRepository.find({
        where: { ...eventWhere, isFeatured: true },
        relations: ['organizer', 'category'],
        take: 5,
        order: { date: 'ASC' },
      });

      // Upcoming Events (Next 10)
      const upcomingEvents = await eventRepository.find({
        where: eventWhere,
        relations: ['organizer', 'category'],
        take: limit,
        order: { date: 'ASC' },
      });

      response.featuredEvents = featuredEvents;
      response.upcomingEvents = upcomingEvents;
    }

    if (!type || type === 'all' || type === 'plan') {
      const planWhere: FindOptionsWhere<Plan> = {
        status: PlanStatus.ACTIVE,
        date: MoreThanOrEqual(now),
      };

      if (city) planWhere.location = Like(`%${city}%`);

      const activePlans = await planRepository.find({
        where: planWhere,
        relations: ['creator', 'creator.personalProfile'],
        take: limit,
        order: { date: 'ASC' },
      });

      response.activePlans = activePlans;
    }

    return res.json(response);
  } catch (error) {
    console.error('Get feed error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });

    return res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const search = async (req: Request, res: Response) => {
  try {
    const { q, type, city } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = `%${q}%`;
    const response: any = {};

    if (!type || type === 'all' || type === 'event') {
      const eventWhere: FindOptionsWhere<Event>[] = [
        { title: Like(searchTerm), status: EventStatus.APPROVED },
        { description: Like(searchTerm), status: EventStatus.APPROVED },
      ];

      // Note: AND city logic is strict with OR for title/desc. 
      // Simplified: Just search title/desc for now.

      const events = await eventRepository.find({
        where: eventWhere,
        relations: ['organizer', 'category'],
        take: 10,
      });
      response.events = events;
    }

    if (!type || type === 'all' || type === 'plan') {
      const planWhere: FindOptionsWhere<Plan>[] = [
        { title: Like(searchTerm), status: PlanStatus.ACTIVE },
        { description: Like(searchTerm), status: PlanStatus.ACTIVE },
      ];

      const plans = await planRepository.find({
        where: planWhere,
        relations: ['creator', 'creator.personalProfile'],
        take: 10,
      });
      response.plans = plans;
    }

    return res.json(response);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNearbyContent = async (req: Request, res: Response) => {
  try {
    // Mock implementation returning everything for now
    // In real app: Use PostGIS with ST_DWithin

    // Just reuse getFeed internal logic for now
    const limit = 10;
    const now = new Date();

    const events = await eventRepository.find({
      where: { status: EventStatus.APPROVED, date: MoreThanOrEqual(now) },
      relations: ['organizer', 'category'],
      take: limit,
      order: { date: 'ASC' },
    });

    const plans = await planRepository.find({
      where: { status: PlanStatus.ACTIVE, date: MoreThanOrEqual(now) },
      relations: ['creator', 'creator.personalProfile'],
      take: limit,
      order: { date: 'ASC' },
    });

    return res.json({ events, plans });
  } catch (error) {
    console.error('Get nearby content error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};