import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import * as userController from '../controllers/user.controller';

const router = Router();

// Update user profile (authenticated)
router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().trim().notEmpty(),
    body('bio').optional().trim(),
    body('city').optional().trim(),
  ],
  validateRequest,
  userController.updateProfile
);

// Upload profile photo
router.post(
  '/profile/photo',
  authenticate,
  userController.uploadProfilePhoto
);

// Add additional image
router.post(
  '/profile/images',
  authenticate,
  userController.addProfileImage
);

// Remove profile image
router.delete(
  '/profile/images/:imageUrl',
  authenticate,
  userController.removeProfileImage
);

// Get user's applications
router.get(
  '/applications',
  authenticate,
  userController.getUserApplications
);

// Get user's plans
router.get('/:userId/plans', optionalAuth, userController.getUserPlans);

// Get user profile (public) - Must be last to avoid capturing other routes
router.get('/:username', optionalAuth, userController.getUserProfile);

export default router;