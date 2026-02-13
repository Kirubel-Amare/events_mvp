import { Request, Response } from 'express';
import { Between, FindOptionsWhere, LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Event, EventStatus } from '../models/Event';
import { OrganizerProfile } from '../models/OrganizerProfile';
import { Application } from '../models/Application';
import { AuthRequest } from '../middleware/auth';

const eventRepository = AppDataSource.getRepository(Event);
const organizerProfileRepository = AppDataSource.getRepository(OrganizerProfile);
const applicationRepository = AppDataSource.getRepository(Application);

import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../models/Notification';
import { ApplicationStatus } from '../models/Application';

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { city, category, dateFrom, dateTo, search, sort, order } = req.query;

    const where: FindOptionsWhere<Event> = {
      status: EventStatus.APPROVED, // Only show approved events publically? Or all for MVP? Let's say APPROVED.
      // But verify-auth script might fail if default is PENDING. 
      // Let's check Event model default. Default is PENDING.
      // For MVP, maybe show all non-cancelled? Or just assume auto-approval for now.
      // Let's stick to status: EventStatus.APPROVED and make sure createEvent sets it to APPROVED for now.
    };

    if (city) {
      where.city = Like(`%${city}%`);
    }

    if (category) {
      // Assuming category is a string name or ID. If ID:
      // where.categoryId = parseInt(category as string);
      // If name, we need relation. Let's assume ID for now as per routes optional().isInt()
      where.categoryId = parseInt(category as string);
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

    const [events, total] = await eventRepository.findAndCount({
      where,
      relations: ['organizer', 'category'],
      order: sort ? { [sort as string]: (order as string || 'DESC').toUpperCase() } : { date: 'ASC' },
      skip,
      take: limit,
    });

    return res.json({
      events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get all events error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFeaturedEvents = async (req: Request, res: Response) => {
  try {
    const events = await eventRepository.find({
      where: { isFeatured: true, status: EventStatus.APPROVED },
      relations: ['organizer', 'category'],
      take: 5,
      order: { createdAt: 'DESC' },
    });

    return res.json(events);
  } catch (error) {
    console.error('Get featured events error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await eventRepository.findOne({
      where: { id },
      relations: ['organizer', 'category', 'organizer.user'],
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.json(event);
  } catch (error) {
    console.error('Get event by id error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await AppDataSource.getRepository('Category').find();
    return res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      title,
      description,
      city,
      date,
      price,
      capacity,
      externalLink,
      categoryId,
      mainImage,
      images
    } = req.body;

    const organizerProfile = await organizerProfileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!organizerProfile) {
      return res.status(403).json({ error: 'User is not an organizer' });
    }

    const { user } = organizerProfile;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const eventsThisWeek = await eventRepository.count({
      where: {
        organizerId: organizerProfile.id,
        createdAt: MoreThanOrEqual(oneWeekAgo),
      },
    });

    if (eventsThisWeek >= user.weeklyEventQuota) {
      return res.status(403).json({
        error: `Weekly event creation limit reached (${user.weeklyEventQuota}). Please apply for a quota increase in your dashboard.`,
      });
    }

    const event = new Event();
    event.title = title;
    event.description = description;
    event.city = city;
    event.date = new Date(date);
    event.isFeatured = true; // Auto-feature for MVP visibility
    event.price = price;
    event.capacity = capacity;
    event.externalLink = externalLink || null;
    event.categoryId = categoryId;
    event.mainImage = mainImage || null;
    event.images = images || [];
    event.organizer = organizerProfile;
    event.status = EventStatus.APPROVED;
    // Handle image from body if provided (local upload logic comes later)
    if (req.body.mainImage) event.mainImage = req.body.mainImage;

    await eventRepository.save(event);

    return res.status(201).json({ message: 'Event created', event });
  } catch (error) {
    console.error('Create event error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // Event ID
    const userId = req.user!.id;

    const event = await eventRepository.findOne({
      where: { id },
      relations: ['organizer'],
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.organizer.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const {
      title,
      description,
      city,
      date,
      price,
      capacity,
      externalLink,
      categoryId,
      mainImage,
      images
    } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (city) event.city = city;
    if (date) event.date = new Date(date);
    if (price !== undefined) event.price = price;
    if (capacity !== undefined) event.capacity = capacity;
    if (externalLink !== undefined) event.externalLink = externalLink || null;
    if (categoryId !== undefined) event.categoryId = categoryId;
    if (mainImage !== undefined) event.mainImage = mainImage || null;
    if (images !== undefined) event.images = images || [];

    await eventRepository.save(event);

    return res.json({ message: 'Event updated', event });
  } catch (error) {
    console.error('Update event error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    // user.isAdmin should also be able to delete.
    const isAdmin = req.user?.isAdmin;

    const event = await eventRepository.findOne({
      where: { id },
      relations: ['organizer'],
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (!isAdmin && event.organizer.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await eventRepository.remove(event);

    return res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const applyToEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // Event ID
    const userId = req.user!.id;
    const { message } = req.body;

    // Check if event exists
    const event = await eventRepository.findOne({ where: { id } });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if already applied
    const existingApplication = await applicationRepository.findOne({
      where: { userId, eventId: id },
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied to this event' });
    }

    const application = new Application();
    application.userId = userId;
    application.eventId = id;
    application.message = message;

    await applicationRepository.save(application);

    // Notify Organizer
    const eventWithOrganizer = await eventRepository.findOne({
      where: { id },
      relations: ['organizer']
    });

    if (eventWithOrganizer && eventWithOrganizer.organizer) {
      await NotificationService.notifyEventOrganizer(
        eventWithOrganizer.organizer.userId,
        req.user?.name || 'Someone',
        event.title,
        id
      );
    }

    return res.status(201).json({ message: 'Applied to event', application });
  } catch (error) {
    console.error('Apply to event error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const cancelApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // Event ID
    const userId = req.user!.id;

    const application = await applicationRepository.findOne({
      where: { userId, eventId: id },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    await applicationRepository.remove(application);

    return res.json({ message: 'Application cancelled' });
  } catch (error) {
    console.error('Cancel application error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEventApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // Event ID
    const userId = req.user!.id;

    const event = await eventRepository.findOne({
      where: { id },
      relations: ['organizer'],
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const isOrganizer = event.organizer.userId === userId;
    const isAdmin = req.user?.isAdmin;

    // Fetch applications
    const applications = await applicationRepository.find({
      where: { eventId: id },
      relations: ['user', 'user.personalProfile'],
      order: { appliedAt: 'DESC' },
    });

    // If organizer or admin, return all data
    if (isOrganizer || isAdmin) {
      return res.json(applications);
    }

    // Otherwise, only return approved applications and hide private messages
    const publicApplications = applications
      .filter(app => app.status === 'approved' || app.userId === userId) // Show their own and approved ones
      .map(app => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message, ...safeApp } = app;
        return safeApp;
      });

    return res.json(publicApplications);
  } catch (error) {
    console.error('Get event applications error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id, applicationId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    const userId = req.user!.id;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await applicationRepository.findOne({
      where: { id: applicationId, eventId: id },
      relations: ['event', 'event.organizer']
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const isAdmin = req.user?.isAdmin;
    const isOrganizer = application.event?.organizer?.userId === userId;

    if (!isAdmin && !isOrganizer) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    application.status = status as ApplicationStatus;
    await applicationRepository.save(application);

    // Notify Applicant
    await NotificationService.notifyApplicationStatus(
      application.userId,
      application.event?.title || 'Event',
      status,
      `/dashboard/applications`
    );

    return res.json({ message: `Application ${status}`, application });
  } catch (error) {
    console.error('Update application status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};