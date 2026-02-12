import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { PersonalProfile } from '../models/PersonalProfile';
import { Plan } from '../models/Plan';
import { Application } from '../models/Application';
import { OrganizerApplication } from '../models/OrganizerApplication';
import { AuthRequest } from '../middleware/auth';

const userRepository = AppDataSource.getRepository(User);
const personalProfileRepository = AppDataSource.getRepository(PersonalProfile);
const planRepository = AppDataSource.getRepository(Plan);
const applicationRepository = AppDataSource.getRepository(Application);
const organizerApplicationRepository = AppDataSource.getRepository(OrganizerApplication);

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username } = req.params;

    const profile = await personalProfileRepository.findOne({
      where: { username },
      relations: ['user'],
    });

    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if looking at own profile
    const isOwner = req.user?.id === profile.userId;

    const response = {
      ...profile,
      email: isOwner ? profile.user.email : undefined,
      isOrganizer: profile.user.isOrganizer,
      // Add other relevant fields
    };

    return res.json(response);
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id; // Authenticated
    const { name, fullname, bio, city, profilePhoto, profilePicture } = req.body;

    let profile = await personalProfileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    let user;

    if (!profile) {
      // Profile missing (legacy or seeded data), create one
      user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      profile = new PersonalProfile();
      profile.userId = userId;
      profile.user = user;
      profile.name = user.name || '';
      profile.username = user.username || '';
    } else {
      user = profile.user;
    }

    if (name) {
      profile.name = name;
      user.name = name;
    }

    if (fullname) {
      user.fullname = fullname;
    }

    if (profilePicture) {
      user.profilePicture = profilePicture;
    }

    if (profilePhoto) {
      profile.profilePhoto = profilePhoto;
      // Also update user.profilePicture if it's the main one
      user.profilePicture = profilePhoto;
    }

    if (bio !== undefined) profile.bio = bio;
    if (city !== undefined) profile.city = city;

    await Promise.all([
      personalProfileRepository.save(profile),
      userRepository.save(user),
    ]);

    return res.json({
      message: 'Profile updated successfully',
      profile: { ...profile, user: undefined },
      user: {
        id: user.id,
        name: user.name,
        fullname: user.fullname,
        username: user.username,
        profilePicture: user.profilePicture,
        role: user.role,
        isOrganizer: user.isOrganizer,
        isAdmin: user.isAdmin,
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadProfilePhoto = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({ error: 'Photo URL is required' });
    }

    const profile = await personalProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.profilePhoto = photoUrl;
    await personalProfileRepository.save(profile);

    return res.json({ message: 'Profile photo updated', profile });
  } catch (error) {
    console.error('Upload profile photo error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const addProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const profile = await personalProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (!profile.additionalImages) {
      profile.additionalImages = [];
    }

    // Limit number of images (e.g., 5)
    if (profile.additionalImages.length >= 5) {
      return res.status(400).json({ error: 'Maximum 5 additional images allowed' });
    }

    profile.additionalImages.push(imageUrl);
    await personalProfileRepository.save(profile);

    return res.json({ message: 'Image added', profile });
  } catch (error) {
    console.error('Add profile image error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { imageUrl } = req.params;

    // Decode URL if it was encoded
    const decodedUrl = decodeURIComponent(imageUrl);

    const profile = await personalProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (profile.additionalImages) {
      profile.additionalImages = profile.additionalImages.filter(
        (img) => img !== decodedUrl
      );
      await personalProfileRepository.save(profile);
    }

    return res.json({ message: 'Image removed', profile });
  } catch (error) {
    console.error('Remove profile image error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserPlans = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const plans = await planRepository.find({
      where: { creatorId: userId },
      order: { createdAt: 'DESC' },
    });

    return res.json(plans);
  } catch (error) {
    console.error('Get user plans error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const apps = await applicationRepository.find({
      where: { userId },
      relations: ['plan', 'event'],
    });

    const organizerApps = await organizerApplicationRepository.find({
      where: { userId },
    });

    const unifiedApps = [
      ...apps.map(app => ({
        ...app,
        type: app.planId ? 'plan' : 'event',
        createdAt: app.appliedAt,
      })),
      ...organizerApps.map(app => ({
        ...app,
        type: 'organizer',
      }))
    ] as any[];

    unifiedApps.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return res.json(unifiedApps);
  } catch (error) {
    console.error('Get user applications error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};