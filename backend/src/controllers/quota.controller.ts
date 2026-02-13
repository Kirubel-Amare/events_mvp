import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { QuotaRequest, QuotaRequestStatus, QuotaRequestType } from '../models/QuotaRequest';
import { AuthRequest } from '../middleware/auth';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../models/Notification';

const quotaRequestRepository = AppDataSource.getRepository(QuotaRequest);
const userRepository = AppDataSource.getRepository(User);

export const createQuotaRequest = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { type, requestedValue, reason } = req.body;

        if (!Object.values(QuotaRequestType).includes(type)) {
            return res.status(400).json({ error: 'Invalid quota type' });
        }

        if (!requestedValue || requestedValue <= 0) {
            return res.status(400).json({ error: 'Invalid requested value' });
        }

        // Check for existing pending request of same type
        const existingRequest = await quotaRequestRepository.findOne({
            where: {
                userId,
                type,
                status: QuotaRequestStatus.PENDING,
            },
        });

        if (existingRequest) {
            return res.status(400).json({ error: 'You already have a pending request for this quota type' });
        }

        const request = new QuotaRequest();
        request.userId = userId;
        request.type = type;
        request.requestedValue = requestedValue;
        request.reason = reason;

        await quotaRequestRepository.save(request);

        // Notify Admins
        await NotificationService.notifyAdmins({
            type: NotificationType.WARNING,
            title: 'New Quota Request',
            message: `${req.user?.name || 'An organizer'} has requested a quota increase.`,
            link: '/admin/quotas'
        });

        return res.status(201).json({ message: 'Quota request submitted successfully', request });
    } catch (error) {
        console.error('Create quota request error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMyQuotaRequests = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        const requests = await quotaRequestRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });

        return res.json(requests);
    } catch (error) {
        console.error('Get my quota requests error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllQuotaRequests = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.isAdmin) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const requests = await quotaRequestRepository.find({
            relations: ['user', 'user.personalProfile'],
            order: { createdAt: 'DESC' },
        });

        return res.json(requests);
    } catch (error) {
        console.error('Get all quota requests error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateQuotaRequestStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.isAdmin) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const { id } = req.params;
        const { status, adminComment } = req.body;

        if (!Object.values(QuotaRequestStatus).includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const request = await quotaRequestRepository.findOne({
            where: { id },
            relations: ['user'],
        });

        if (!request) {
            return res.status(404).json({ error: 'Quota request not found' });
        }

        request.status = status;
        if (adminComment !== undefined) request.adminComment = adminComment;

        // If approved, update user quota
        if (status === QuotaRequestStatus.APPROVED) {
            const user = request.user;
            if (request.type === QuotaRequestType.EVENT) {
                user.weeklyEventQuota = request.requestedValue;
            } else if (request.type === QuotaRequestType.PLAN) {
                user.weeklyPlanQuota = request.requestedValue;
            }
            await userRepository.save(user);
        }

        await quotaRequestRepository.save(request);

        // Notify User
        await NotificationService.createNotification({
            userId: request.userId,
            type: status === QuotaRequestStatus.APPROVED ? NotificationType.SUCCESS : NotificationType.WARNING,
            title: `Quota Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: status === QuotaRequestStatus.APPROVED
                ? `Your request for more ${request.type} quota has been approved!`
                : `Your request for more ${request.type} quota has been ${status}. ${adminComment ? 'Comment: ' + adminComment : ''}`,
            link: '/organizer/dashboard'
        });

        return res.json({ message: `Quota request ${status}`, request });
    } catch (error) {
        console.error('Update quota request status error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
