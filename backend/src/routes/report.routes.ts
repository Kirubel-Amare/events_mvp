import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createReport, getReports, updateReportStatus } from '../controllers/report.controller';

const router = Router();

router.post('/', authenticate, createReport);
router.get('/', authenticate, getReports);
router.put('/:id/status', authenticate, updateReportStatus);

export default router;
