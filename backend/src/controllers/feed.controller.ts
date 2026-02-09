import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const getFeed = async (req: AuthRequest, res: Response) => {
  res.json({ message: 'Get feed endpoint - To be implemented' });
};

export const getCategories = async (req: Request, res: Response) => {
  res.json({ message: 'Get categories endpoint - To be implemented' });
};

export const search = async (req: Request, res: Response) => {
  res.json({ message: 'Search endpoint - To be implemented' });
};

export const getNearbyContent = async (req: AuthRequest, res: Response) => {
  res.json({ message: 'Get nearby content endpoint - To be implemented' });
};