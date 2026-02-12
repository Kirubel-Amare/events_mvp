import { Router } from 'express';
import { body, query } from 'express-validator';
import { authenticate, optionalAuth, requireOrganizer, requireOrganizerOrAdmin } from '../middleware/auth';
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

// Get all categories
router.get('/categories', optionalAuth, eventController.getCategories);

// Get single event
router.get('/:id', optionalAuth, eventController.getEventById);

// Create event (organizer only)
router.post(
  '/',
  authenticate,
  requireOrganizer,
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('date').isISO8601(),
    body('price').optional().trim(),
    body('capacity').optional({ checkFalsy: true }).isInt({ min: 1 }),
    body('externalLink').optional({ checkFalsy: true }).isURL(),
    body('categoryId').optional().isInt(),
  ],
  validateRequest,
  eventController.createEvent
);

// Update event (organizer only)
router.put(
  '/:id',
  authenticate,
  requireOrganizer,
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('city').optional().trim().notEmpty(),
    body('date').optional().isISO8601(),
    body('price').optional().trim(),
    body('capacity').optional({ checkFalsy: true }).isInt({ min: 1 }),
    body('externalLink').optional({ checkFalsy: true }).isURL(),
    body('categoryId').optional().isInt(),
  ],
  validateRequest,
  eventController.updateEvent
);

// Delete event (organizer or admin)
router.delete('/:id', authenticate, requireOrganizerOrAdmin, eventController.deleteEvent);

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

// Get event applications (organizer or admin)
router.get('/:id/applications', authenticate, requireOrganizerOrAdmin, eventController.getEventApplications);

export default router;