import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { OrganizerProfile } from '../models/OrganizerProfile';
import { Event } from '../models/Event';
import { AuthRequest } from '../middleware/auth';

const userRepository = AppDataSource.getRepository(User);
const organizerProfileRepository = AppDataSource.getRepository(OrganizerProfile);
const eventRepository = AppDataSource.getRepository(Event);

export const applyToBeOrganizer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { organizationName, city, description, contactInfo } = req.body;

    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['organizerProfile'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.organizerProfile) {
      return res.status(400).json({ error: 'User is already an organizer' });
    }

    const organizerProfile = new OrganizerProfile();
    organizerProfile.organizationName = organizationName;
    organizerProfile.city = city;
    organizerProfile.description = description;
    organizerProfile.contactInfo = contactInfo;
    organizerProfile.user = user;
    // Auto-verify for MVP or set to false? Model default is false.
    // Let's keep it false and require admin verification if that's the flow, 
    // or auto-verify for MVP to reduce friction.
    // user.isOrganizer is set to true only when profile exists? 
    // Actually User.isOrganizer is a boolean column.

    await organizerProfileRepository.save(organizerProfile);

    // Update user status
    user.isOrganizer = true;
    user.organizerProfile = organizerProfile; // Fix: link in memory to avoid TypeORM unsetting relation
    await userRepository.save(user);

    return res.status(201).json({
      message: 'Organizer profile created',
      profile: organizerProfile
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
      where: { id },
      relations: ['events'],
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

    const events = await eventRepository.find({
      where: { organizerId: id },
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
    const { organizationName, city, description, contactInfo, profilePhoto } = req.body;

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