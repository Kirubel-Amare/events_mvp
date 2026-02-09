import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validateFile } from '../middleware/validation';
import * as uploadController from '../controllers/upload.controller';
import { upload } from '../config/multer';

const router = Router();

// Upload single image (authenticated)
router.post(
  '/image',
  authenticate,
  upload.single('image'),
  validateFile,
  uploadController.uploadImage
);

// Upload multiple images (authenticated)
router.post(
  '/images',
  authenticate,
  upload.array('images', 5),
  validateFile,
  uploadController.uploadImages
);

// Delete uploaded image (authenticated)
router.delete(
  '/:filename',
  authenticate,
  uploadController.deleteImage
);

export default router;  