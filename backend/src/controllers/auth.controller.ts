import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { PersonalProfile } from '../models/PersonalProfile';
import { Helpers } from '../utils/helpers';
import { config } from '../config/env';
import { AuthRequest } from '../middleware/auth';

const userRepository = AppDataSource.getRepository(User);
const personalProfileRepository = AppDataSource.getRepository(PersonalProfile);

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, username } = req.body;

    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Check if username is taken
    const existingUsername = await personalProfileRepository.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already in use' });
    }

    // Hash password
    const passwordHash = await Helpers.hashPassword(password);

    // Create user
    const user = new User();
    user.email = email;
    user.passwordHash = passwordHash;

    // Create personal profile
    const profile = new PersonalProfile();
    profile.name = name;
    profile.username = username;
    profile.user = user;

    // Save user (cascade will save profile)
    await userRepository.save(user);

    // Generate token
    const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        profile: {
          name: profile.name,
          username: profile.username
        }
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user with password hash
    const user = await userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .leftJoinAndSelect('user.personalProfile', 'profile')
      .leftJoinAndSelect('user.organizerProfile', 'organizerProfile')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await Helpers.comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await userRepository.save(user);

    // Generate token
    const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        isOrganizer: user.isOrganizer,
        isAdmin: user.isAdmin,
        profile: user.personalProfile ? {
          name: user.personalProfile.name,
          username: user.personalProfile.username
        } : null,
        organizerProfile: user.organizerProfile
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  // Since we're using stateless JWT, we can't really "invalidate" the token server-side 
  // without a blacklist. For now, we just send a success response.
  res.json({ message: 'Logged out successfully' });
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    // User is already attached to req by auth middleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        isOrganizer: user.isOrganizer,
        isAdmin: user.isAdmin,
        profile: user.personalProfile,
        organizerProfile: user.organizerProfile
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  res.json({ message: 'Refresh token endpoint - To be implemented' });
};

export const forgotPassword = async (req: Request, res: Response) => {
  res.json({ message: 'Forgot password endpoint - To be implemented' });
};

export const resetPassword = async (req: Request, res: Response) => {
  res.json({ message: 'Reset password endpoint - To be implemented' });
};