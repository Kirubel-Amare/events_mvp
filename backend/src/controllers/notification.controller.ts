import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

const notificationRepository = AppDataSource.getRepository(Notification);

export const getNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const [notifications, total] = await notificationRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });

        const unreadCount = await notificationRepository.count({
            where: { userId, isRead: false },
        });

        return res.json({
            notifications,
            total,
            unreadCount,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getNotificationById = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params;

        const notification = await notificationRepository.findOne({
            where: { id, userId },
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        return res.json(notification);
    } catch (error) {
        console.error('Get notification by id error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params;

        const notification = await notificationRepository.findOne({
            where: { id, userId },
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        notification.isRead = true;
        await notificationRepository.save(notification);

        return res.json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error('Mark as read error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        await notificationRepository.update({ userId, isRead: false }, { isRead: true });

        return res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all as read error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params;

        const notification = await notificationRepository.findOne({
            where: { id, userId },
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await notificationRepository.remove(notification);

        return res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Delete notification error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
