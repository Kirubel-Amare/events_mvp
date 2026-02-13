import { apiClient } from './client';

export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    link: string | null;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationsResponse {
    notifications: Notification[];
    total: number;
    unreadCount: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const notificationApi = {
    getNotifications: async (page = 1, limit = 20): Promise<NotificationsResponse> => {
        const response = await apiClient.get('/notifications', {
            params: { page, limit }
        });
        return response.data;
    },

    getNotificationById: async (id: string): Promise<Notification> => {
        const response = await apiClient.get(`/notifications/${id}`);
        return response.data;
    },

    markAsRead: async (id: string) => {
        const response = await apiClient.patch(`/notifications/${id}/read`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await apiClient.patch('/notifications/read-all');
        return response.data;
    },

    deleteNotification: async (id: string) => {
        const response = await apiClient.delete(`/notifications/${id}`);
        return response.data;
    }
};
