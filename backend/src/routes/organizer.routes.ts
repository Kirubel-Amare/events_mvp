import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import * as organizerController from '../controllers/organizer.controller';

const router = Router();

// Apply to become organizer
router.post(
  '/apply',
  authenticate,
  [
    body('name').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('contactInfo').trim().notEmpty(),
  ],
  validateRequest,
  organizerController.applyToBeOrganizer
);

// Get organizer profile
router.get('/:id', organizerController.getOrganizerProfile);

// Get organizer events
router.get('/:id/events', organizerController.getOrganizerEvents);

// Update organizer profile (organizer only)
router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().trim().notEmpty(),
    body('city').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('contactInfo').optional().trim().notEmpty(),
    body('profileImage').optional().trim(),
  ],
  validateRequest,
  organizerController.updateOrganizerProfile
);

// Request event featuring (organizer only)
router.post(
  '/events/:id/feature',
  authenticate,
  organizerController.requestEventFeaturing
);

export default router;