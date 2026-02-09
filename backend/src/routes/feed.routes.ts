import { Router } from 'express';
import { query } from 'express-validator';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import * as feedController from '../controllers/feed.controller';

const router = Router();

// Get main feed
router.get(
  '/',
  optionalAuth,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('city').optional().trim(),
    query('category').optional().trim(),
    query('type').optional().isIn(['event', 'plan', 'all']),
  ],
  validateRequest,
  feedController.getFeed
);

// Get categories
router.get('/categories', feedController.getCategories);

// Search
router.get(
  '/search',
  [
    query('q').trim().notEmpty(),
    query('type').optional().isIn(['event', 'plan', 'all']),
    query('city').optional().trim(),
    query('category').optional().trim(),
  ],
  validateRequest,
  feedController.search
);

// Get nearby events/plans (mock geolocation)
router.get(
  '/nearby',
  optionalAuth,
  [
    query('lat').optional().isFloat(),
    query('lng').optional().isFloat(),
    query('radius').optional().isInt({ min: 1, max: 100 }),
  ],
  validateRequest,
  feedController.getNearbyContent
);

export default router;