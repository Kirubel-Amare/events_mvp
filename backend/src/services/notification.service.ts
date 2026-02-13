import { AppDataSource } from '../config/database';
import { Notification, NotificationType } from '../models/Notification';
import { User, UserRole } from '../models/User';

export class NotificationService {
    private static notificationRepository = AppDataSource.getRepository(Notification);
    private static userRepository = AppDataSource.getRepository(User);

    /**
     * Create a notification for a specific user
     */
    static async createNotification({
        userId,
        type = NotificationType.INFO,
        title,
        message,
        link = null
    }: {
        userId: string;
        type?: NotificationType;
        title: string;
        message: string;
        link?: string | null;
    }) {
        try {
            const notification = new Notification();
            notification.userId = userId;
            notification.type = type;
            notification.title = title;
            notification.message = message;
            notification.link = link;

            return await this.notificationRepository.save(notification);
        } catch (error) {
            console.error('Error creating notification:', error);
            // Don't throw error to prevent breaking the main activity flow
            return null;
        }
    }

    /**
     * Notify all administrators
     */
    static async notifyAdmins({
        type = NotificationType.WARNING,
        title,
        message,
        link = null
    }: {
        type?: NotificationType;
        title: string;
        message: string;
        link?: string | null;
    }) {
        try {
            const admins = await this.userRepository.find({
                where: { role: UserRole.ADMIN }
            });

            const notifications = admins.map(admin => {
                const notification = new Notification();
                notification.userId = admin.id;
                notification.type = type;
                notification.title = title;
                notification.message = message;
                notification.link = link;
                return notification;
            });

            if (notifications.length > 0) {
                await this.notificationRepository.save(notifications);
            }
        } catch (error) {
            console.error('Error notifying admins:', error);
        }
    }

    /**
     * Helper to notify about event applications
     */
    static async notifyEventOrganizer(organizerUserId: string, applicantName: string, eventTitle: string, eventId: string) {
        return this.createNotification({
            userId: organizerUserId,
            type: NotificationType.INFO,
            title: 'New Event Application',
            message: `${applicantName} has applied to your event: ${eventTitle}`,
            link: `/organizer/events/${eventId}/applications`
        });
    }

    /**
     * Helper to notify about application status changes
     */
    static async notifyApplicationStatus(userId: string, eventTitle: string, status: string, link: string) {
        const type = status === 'approved' ? NotificationType.SUCCESS : NotificationType.WARNING;
        return this.createNotification({
            userId,
            type,
            title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: `Your application to "${eventTitle}" has been ${status}.`,
            link
        });
    }
}
