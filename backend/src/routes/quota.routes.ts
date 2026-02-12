import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
    createQuotaRequest,
    getMyQuotaRequests,
    getAllQuotaRequests,
    updateQuotaRequestStatus
} from '../controllers/quota.controller';

const router = Router();

// User routes
router.post('/request', authenticate, createQuotaRequest);
router.get('/my-requests', authenticate, getMyQuotaRequests);

// Admin routes
router.get('/all', authenticate, getAllQuotaRequests);
router.patch('/:id/status', authenticate, updateQuotaRequestStatus);

export default router;
