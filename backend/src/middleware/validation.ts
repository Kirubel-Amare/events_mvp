import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Validators } from '../utils/validators';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return next();
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }

  if (req.file.size > maxSize) {
    return res.status(400).json({ error: 'File too large' });
  }

  next();
};

export const validateDate = (field: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const date = new Date(req.body[field]);
    
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: `Invalid ${field} date` });
    }

    if (!Validators.isFutureDate(date)) {
      return res.status(400).json({ error: `${field} must be in the future` });
    }

    req.body[field] = date;
    next();
  };
};