import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const uploadImage = async (req: AuthRequest, res: Response) => {
  res.json({ message: 'Upload image endpoint - To be implemented' });
};

export const uploadImages = async (req: AuthRequest, res: Response) => {
  res.json({ message: 'Upload images endpoint - To be implemented' });
};

export const deleteImage = async (req: AuthRequest, res: Response) => {
  res.json({ message: 'Delete image endpoint - To be implemented' });
};  