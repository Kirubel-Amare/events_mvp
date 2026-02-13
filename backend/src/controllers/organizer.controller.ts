import { In, MoreThanOrEqual } from 'typeorm';
import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { OrganizerProfile } from '../models/OrganizerProfile';
import { Event } from '../models/Event';
import { AuthRequest } from '../middleware/auth';
import { OrganizerApplication, ApplicationStatus } from '../models/OrganizerApplication';

import { Application } from '../models/Application';
import { Review } from '../models/Review';
import { OrganizerFollower } from '../models/OrganizerFollower';
import { calculateGrowth } from '../utils/stats.utils';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../models/Notification';

const userRepository = AppDataSource.getRepository(User);
const organizerProfileRepository = AppDataSource.getRepository(OrganizerProfile);
const eventRepository = AppDataSource.getRepository(Event);
const organizerApplicationRepository = AppDataSource.getRepository(OrganizerApplication);
const applicationRepository = AppDataSource.getRepository(Application);
const reviewRepository = AppDataSource.getRepository(Review);
const followerRepository = AppDataSource.getRepository(OrganizerFollower);

export const applyToBeOrganizer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { reason, organizationName } = req.body;

    // Check if there's already a pending or approved application
    const existingApplication = await organizerApplicationRepository.findOne({
      where: [
        { userId, status: ApplicationStatus.PENDING },
        { userId, status: ApplicationStatus.APPROVED }
      ]
    });

    if (existingApplication) {
      return res.status(400).json({
        error: existingApplication.status === ApplicationStatus.APPROVED
          ? 'You are already an organizer'
          : 'You already have a pending application'
      });
    }

    const application = new OrganizerApplication();
    application.userId = userId;
    application.reason = reason;
    application.organizationName = organizationName;
    application.status = ApplicationStatus.PENDING;

    await organizerApplicationRepository.save(application);

    // Notify Admins
    await NotificationService.notifyAdmins({
      type: NotificationType.WARNING,
      title: 'New Organizer Application',
      message: `${req.user?.name || 'A user'} has applied to be an organizer.`,
      link: '/admin/organizers'
    });

    return res.status(201).json({
      message: 'Application submitted successfully. It will be reviewed by an admin.',
      application
    });
  } catch (error) {
    console.error('Apply to be organizer error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrganizerProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const profile = await organizerProfileRepository.findOne({
      where: [
        { id },
        { userId: id }
      ],
      relations: ['events', 'user'],
    });

    if (!profile) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    return res.json(profile);
  } catch (error) {
    console.error('Get organizer profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrganizerEvents = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Try to find by organizer id first, then by userId
    const events = await eventRepository.find({
      where: [
        { organizerId: id },
        { organizer: { userId: id } }
      ],
      relations: ['organizer'],
      order: { date: 'ASC' },
    });

    return res.json(events);
  } catch (error) {
    console.error('Get organizer events error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrganizerProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { organizationName, city, description, contactInfo, profilePhoto, website, instagram, twitter } = req.body;

    const profile = await organizerProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Organizer profile not found' });
    }

    if (organizationName) profile.organizationName = organizationName;
    if (city) profile.city = city;
    if (description) profile.description = description;
    if (contactInfo) profile.contactInfo = contactInfo;
    if (profilePhoto !== undefined) profile.profilePhoto = profilePhoto;
    if (website !== undefined) profile.website = website;
    if (instagram !== undefined) profile.instagram = instagram;
    if (twitter !== undefined) profile.twitter = twitter;

    await organizerProfileRepository.save(profile);

    return res.json({ message: 'Profile updated', profile });
  } catch (error) {
    console.error('Update organizer profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const requestEventFeaturing = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // Event ID
    const userId = req.user!.id;

    // Verify ownership
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

    // For MVP, we'll just log it or maybe auto-approve?
    // Let's just return success saying request received.
    // TODO: Create a Report or Admin Notification entity

    return res.json({ message: 'Feature request submitted. Admin will review.' });
  } catch (error) {
    console.error('Request event featuring error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrganizerStats = async (req: AuthRequest, res: Response) => {
  try {
    const organizerId = req.params.id;
    console.log(`[DEBUG] Fetching stats for organizer: ${organizerId}`);

    const profile = await organizerProfileRepository.findOne({
      where: [
        { id: organizerId },
        { userId: organizerId }
      ]
    });

    if (!profile) {
      // console.log(`[DEBUG] Organizer profile not found for id: ${organizerId}`);
      return res.status(404).json({ error: 'Organizer not found' });
    }

    const actualOrganizerId = profile.id;
    // console.log(`[DEBUG] Found profile: ${actualOrganizerId}, userId: ${profile.userId}`);

    // Total counts
    const totalEvents = await eventRepository.count({ where: { organizerId: actualOrganizerId } });
    // console.log(`[DEBUG] Total events: ${totalEvents}`);

    // Total attendees (Approved applications)
    const events = await eventRepository.find({ where: { organizerId: actualOrganizerId } });
    const eventIds = events.map(e => e.id);

    let totalAttendees = 0;
    let revenue = 0;
    let totalViews = 0;

    if (eventIds.length > 0) {
      totalAttendees = await applicationRepository.count({
        where: { eventId: In(eventIds), status: ApplicationStatus.APPROVED }
      });

      // Calculate revenue (Price * Approved Applications)
      const approvedApps = await applicationRepository.find({
        where: { eventId: In(eventIds), status: ApplicationStatus.APPROVED },
        relations: ['event']
      });

      approvedApps.forEach(app => {
        if (app.event && app.event.price) {
          const price = parseFloat(app.event.price.replace(/[^0-9.]/g, ''));
          if (!isNaN(price)) revenue += price;
        }
      });

      // Total views
      totalViews = events.reduce((acc, curr) => acc + (curr.views || 0), 0);
    }

    // Followers count
    const followers = await followerRepository.count({ where: { organizerId: actualOrganizerId } });

    // Rating (AVG)
    const reviewStats = await reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .where('review.organizerId = :id', { id: actualOrganizerId })
      .getRawOne();

    const rating = reviewStats.avg ? parseFloat(parseFloat(reviewStats.avg).toFixed(1)) : 0;

    // Growth metrics (Last 30 days)
    // console.log('[DEBUG] Calculating event growth...');
    const eventGrowth = await calculateGrowth(eventRepository, 'createdAt', 30, { organizerId: actualOrganizerId });

    // Only calculate attendee growth if there are events
    const attendeeGrowth = eventIds.length > 0
      ? await calculateGrowth(applicationRepository, 'appliedAt', 30, {
        eventId: In(eventIds),
        status: ApplicationStatus.APPROVED
      })
      : { percentage: 0 };

    // console.log('[DEBUG] Sending response...');
    res.json({
      totalEvents,
      totalAttendees,
      revenue,
      followers,
      rating: rating || 5.0, // Default to 5.0 if no reviews yet
      totalViews,
      growth: {
        events: eventGrowth.percentage,
        attendees: attendeeGrowth.percentage
      }
    });
  } catch (error) {
    console.error('Get organizer stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const followOrganizer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const organizerId = req.params.id; // profile id

    // Check if profile exists
    const profile = await organizerProfileRepository.findOne({
      where: { id: organizerId },
      relations: ['user']
    });

    if (!profile) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    if (profile.userId === userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Check if already following
    const existingFollow = await followerRepository.findOne({
      where: { userId, organizerId }
    });

    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this organizer' });
    }

    const follower = new OrganizerFollower();
    follower.userId = userId;
    follower.organizerId = organizerId;

    await followerRepository.save(follower);

    // Notify organizer
    await NotificationService.createNotification({
      userId: profile.userId,
      type: NotificationType.INFO,
      title: 'New Follower',
      message: `${req.user?.name || 'Someone'} started following you!`,
      link: `/organizer/profile` // Or a followers page if exists
    });

    return res.status(201).json({ message: 'Followed successfully' });
  } catch (error) {
    console.error('Follow organizer error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const unfollowOrganizer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const organizerId = req.params.id;

    const follow = await followerRepository.findOne({
      where: { userId, organizerId }
    });

    if (!follow) {
      return res.status(404).json({ error: 'You are not following this organizer' });
    }

    await followerRepository.remove(follow);

    return res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow organizer error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFollowStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const organizerId = req.params.id;

    const follow = await followerRepository.findOne({
      where: { userId, organizerId }
    });

    return res.json({ isFollowing: !!follow });
  } catch (error) {
    console.error('Get follow status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};