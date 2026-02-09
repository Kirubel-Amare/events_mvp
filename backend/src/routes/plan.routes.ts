import { Router } from 'express';
import { body, query } from 'express-validator';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import * as planController from '../controllers/plan.controller';

const router = Router();

// Get all plans (authenticated users only)
router.get(
  '/',
  authenticate,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('city').optional().trim(),
    query('dateFrom').optional().isISO8601(),
    query('dateTo').optional().isISO8601(),
  ],
  validateRequest,
  planController.getAllPlans
);

// Get single plan
router.get('/:id', authenticate, planController.getPlanById);

// Create plan
router.post(
  '/',
  authenticate,
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('location').trim().notEmpty(),
    body('date').isISO8601(),
    body('externalLink').optional().isURL(),
  ],
  validateRequest,
  planController.createPlan
);

// Update plan
router.put(
  '/:id',
  authenticate,
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('location').optional().trim().notEmpty(),
    body('date').optional().isISO8601(),
    body('externalLink').optional().isURL(),
    body('status').optional().isIn(['active', 'completed', 'cancelled']),
  ],
  validateRequest,
  planController.updatePlan
);

// Delete plan
router.delete('/:id', authenticate, planController.deletePlan);

// Apply to join plan
router.post(
  '/:id/apply',
  authenticate,
  [
    body('message').optional().trim(),
  ],
  validateRequest,
  planController.applyToPlan
);

// Cancel application to plan
router.delete('/:id/apply', authenticate, planController.cancelPlanApplication);

// Get plan applications
router.get('/:id/applications', authenticate, planController.getPlanApplications);

export default router;