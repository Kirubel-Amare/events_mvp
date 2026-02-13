import { apiClient } from './client';

export interface Notification {
    id: string;
    userId: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    isRead: boolean;
    link?: string;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationsResponse {
    notifications: Notification[];
    total: number;
    unreadCount: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const notificationsApi = {
    getAll: async (page = 1, limit = 20) => {
        const response = await apiClient.get<NotificationsResponse>(`/notifications?page=${page}&limit=${limit}`);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get<Notification>(`/notifications/${id}`);
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

    delete: async (id: string) => {
        const response = await apiClient.delete(`/notifications/${id}`);
        return response.data;
    },
};
