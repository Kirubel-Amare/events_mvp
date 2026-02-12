import { Router } from 'express';
import { body, query } from 'express-validator';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import * as adminController from '../controllers/admin.controller';

const router = Router();

// Apply admin middleware to all routes
router.use(authenticate, requireAdmin);

// Event management
router.get(
  '/events/pending',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validateRequest,
  adminController.getPendingEvents
);

router.put(
  '/events/:id/status',
  [
    body('status').isIn(['approved', 'rejected']),
    body('reason').optional().trim(),
  ],
  validateRequest,
  adminController.updateEventStatus
);

router.put(
  '/events/:id/feature',
  [
    body('isFeatured').isBoolean(),
  ],
  validateRequest,
  adminController.toggleEventFeature
);

// Organizer management
router.get(
  '/organizers/applications',
  [
    query('status').optional().isIn(['pending', 'approved', 'rejected']),
  ],
  validateRequest,
  adminController.getOrganizerApplications
);

router.post(
  '/organizers/applications/:id/handle',
  [
    body('status').isIn(['approved', 'rejected']),
    body('adminComment').optional().trim(),
  ],
  validateRequest,
  adminController.handleOrganizerApplication
);

// Report management
router.get(
  '/reports',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['pending', 'reviewed', 'resolved', 'dismissed']),
  ],
  validateRequest,
  adminController.getReports
);

router.put(
  '/reports/:id/status',
  [
    body('status').isIn(['reviewed', 'resolved', 'dismissed']),
    body('notes').optional().trim(),
  ],
  validateRequest,
  adminController.updateReportStatus
);

// Categories management
router.get('/categories', adminController.getCategories);

router.post(
  '/categories',
  [
    body('name').trim().notEmpty(),
    body('icon').optional().trim(),
  ],
  validateRequest,
  adminController.createCategory
);

router.put(
  '/categories/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('icon').optional().trim(),
    body('isActive').optional().isBoolean(),
  ],
  validateRequest,
  adminController.updateCategory
);

router.delete('/categories/:id', adminController.deleteCategory);

// User management
router.get(
  '/users',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('role').optional().isIn(['user', 'organizer', 'admin']),
  ],
  validateRequest,
  adminController.getUsers
);

router.put(
  '/users/:id/role',
  [
    body('role').isIn(['user', 'organizer', 'admin']),
  ],
  validateRequest,
  adminController.updateUserRole
);

// Stats
router.get('/stats', adminController.getStats);
router.get('/recent-activity', authenticate, requireAdmin, adminController.getRecentActivity);

// Update user quota
router.put(
  '/users/:id/quota',
  authenticate,
  requireAdmin,
  [
    body('weeklyEventQuota').optional().isInt({ min: 0 }),
    body('weeklyPlanQuota').optional().isInt({ min: 0 }),
  ],
  validateRequest,
  adminController.updateUserQuota
);

export default router;