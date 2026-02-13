import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Event, EventStatus } from '../models/Event';
import { OrganizerProfile } from '../models/OrganizerProfile';
import { Report, ReportStatus } from '../models/Report';
import { Category } from '../models/Category';
import { User, UserRole } from '../models/User';
import { Plan } from '../models/Plan';
import { AuthRequest } from '../middleware/auth';
import { OrganizerApplication, ApplicationStatus } from '../models/OrganizerApplication';
import { calculateGrowth } from '../utils/stats.utils';

const eventRepository = AppDataSource.getRepository(Event);
const organizerProfileRepository = AppDataSource.getRepository(OrganizerProfile);
const reportRepository = AppDataSource.getRepository(Report);
const categoryRepository = AppDataSource.getRepository(Category);
const userRepository = AppDataSource.getRepository(User);
const planRepository = AppDataSource.getRepository(Plan);
const applicationRepository = AppDataSource.getRepository(OrganizerApplication);

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

export const getOrganizerApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status) where.status = status;

    const applications = await applicationRepository.find({
      where,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    res.json(applications);
  } catch (error) {
    console.error('Get organizer applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const handleOrganizerApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body; // status: 'approved' or 'rejected'

    const application = await applicationRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!application) return res.status(404).json({ error: 'Application not found' });

    application.status = status as ApplicationStatus;
    application.adminComment = adminComment;
    await applicationRepository.save(application);

    if (status === ApplicationStatus.APPROVED) {
      const user = application.user;

      // Update user role
      user.role = UserRole.ORGANIZER;
      user.isOrganizer = true;
      await userRepository.save(user);

      // Create Organizer Profile if it doesn't exist
      let profile = await organizerProfileRepository.findOne({ where: { userId: user.id } });
      if (!profile) {
        profile = new OrganizerProfile();
        profile.userId = user.id;
        profile.organizationName = application.organizationName || user.name || 'Unknown Organization';
        profile.isVerified = true;
        profile.verifiedAt = new Date();
        await organizerProfileRepository.save(profile);
      } else {
        profile.isVerified = true;
        profile.verifiedAt = new Date();
        if (application.organizationName) profile.organizationName = application.organizationName;
        await organizerProfileRepository.save(profile);
      }
    }

    res.json({ message: `Application ${status}`, application });
  } catch (error) {
    console.error('Handle organizer application error:', error);
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
    if (role) where.role = role;

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

    user.role = role as UserRole;
    user.isAdmin = role === UserRole.ADMIN;
    user.isOrganizer = role === UserRole.ORGANIZER;

    await userRepository.save(user);
    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRecentActivity = async (req: AuthRequest, res: Response) => {
  try {
    const recentUsers = await userRepository.find({
      take: 5,
      order: { createdAt: 'DESC' },
      relations: ['personalProfile'],
    });

    const recentEvents = await eventRepository.find({
      take: 5,
      order: { createdAt: 'DESC' },
      relations: ['organizer'],
    });

    const recentReports = await reportRepository.find({
      take: 5,
      order: { createdAt: 'DESC' },
      relations: ['reporter'],
    });

    const activity = [
      ...recentUsers.map(u => ({
        id: `user-${u.id}`,
        type: 'user',
        title: `New user registered: ${u.name || u.email}`,
        time: u.createdAt,
        status: 'New User'
      })),
      ...recentEvents.map(e => ({
        id: `event-${e.id}`,
        type: 'event',
        title: `New event created: ${e.title}`,
        time: e.createdAt,
        status: e.status
      })),
      ...recentReports.map(r => ({
        id: `report-${r.id}`,
        type: 'report',
        title: `New report submitted: ${r.reason.substring(0, 30)}...`,
        time: r.createdAt,
        status: r.status
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10);

    res.json(activity);
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserQuota = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { weeklyEventQuota, weeklyPlanQuota } = req.body;

    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (weeklyEventQuota !== undefined) user.weeklyEventQuota = weeklyEventQuota;
    if (weeklyPlanQuota !== undefined) user.weeklyPlanQuota = weeklyPlanQuota;

    await userRepository.save(user);

    res.json({ message: 'User quota updated successfully', user });
  } catch (error) {
    console.error('Update user quota error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await userRepository.count();
    const totalEvents = await eventRepository.count();
    const totalPlans = await planRepository.count();
    const totalReports = await reportRepository.count();

    const userGrowth = await calculateGrowth(userRepository, 'createdAt');
    const eventGrowth = await calculateGrowth(eventRepository, 'createdAt');
    const planGrowth = await calculateGrowth(planRepository, 'createdAt');
    const reportGrowth = await calculateGrowth(reportRepository, 'createdAt');

    res.json({
      totalUsers,
      totalEvents,
      totalPlans,
      totalReports,
      growth: {
        users: userGrowth.percentage,
        events: eventGrowth.percentage,
        plans: planGrowth.percentage,
        reports: reportGrowth.percentage
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};