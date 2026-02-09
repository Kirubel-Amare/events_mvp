import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

export const uploadImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return the URL. Assuming server is running on localhost:3000
    // In production, this should be the full URL or relative path handled by frontend
    const imageUrl = `/uploads/${req.file.filename}`;

    return res.status(201).json({
      message: 'Image uploaded successfully',
      imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload image error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadImages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = req.files as Express.Multer.File[];
    const imageUrls = files.map(file => `/uploads/${file.filename}`);

    return res.status(201).json({
      message: 'Images uploaded successfully',
      imageUrls
    });
  } catch (error) {
    console.error('Upload images error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteImage = async (req: AuthRequest, res: Response) => {
  try {
    const { filename } = req.params;

    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filepath = path.join(__dirname, '../../public/uploads', filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return res.json({ message: 'Image deleted successfully' });
    } else {
      return res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};  