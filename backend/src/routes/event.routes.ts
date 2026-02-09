import { Router } from 'express';
import { body, query } from 'express-validator';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import * as eventController from '../controllers/event.controller';

const router = Router();

// Get all events (public)
router.get(
  '/',
  optionalAuth,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('city').optional().trim(),
    query('category').optional().trim(),
    query('dateFrom').optional().isISO8601(),
    query('dateTo').optional().isISO8601(),
  ],
  validateRequest,
  eventController.getAllEvents
);

// Get featured events
router.get('/featured', optionalAuth, eventController.getFeaturedEvents);

// Get single event
router.get('/:id', optionalAuth, eventController.getEventById);

// Create event (organizer only)
router.post(
  '/',
  authenticate,
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('date').isISO8601(),
    body('price').optional().trim(),
    body('capacity').optional().isInt({ min: 1 }),
    body('externalLink').optional().isURL(),
    body('categoryId').optional().isInt(),
  ],
  validateRequest,
  eventController.createEvent
);

// Update event (organizer only)
router.put(
  '/:id',
  authenticate,
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('city').optional().trim().notEmpty(),
    body('date').optional().isISO8601(),
    body('price').optional().trim(),
    body('capacity').optional().isInt({ min: 1 }),
    body('externalLink').optional().isURL(),
    body('categoryId').optional().isInt(),
  ],
  validateRequest,
  eventController.updateEvent
);

// Delete event (organizer only)
router.delete('/:id', authenticate, eventController.deleteEvent);

// Apply to join event
router.post(
  '/:id/apply',
  authenticate,
  [
    body('message').optional().trim(),
  ],
  validateRequest,
  eventController.applyToEvent
);

// Cancel application
router.delete('/:id/apply', authenticate, eventController.cancelApplication);

// Get event applications (organizer only)
router.get('/:id/applications', authenticate, eventController.getEventApplications);

export default router;