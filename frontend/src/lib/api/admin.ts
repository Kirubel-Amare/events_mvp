import { apiClient } from './client';
import { User, Event, Category } from '@/types';

export interface AdminStats {
    totalUsers: number;
    totalEvents: number;
    totalPlans: number;
    totalReports: number;
}

export interface AdminReport {
    id: string;
    reason: string;
    status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
    reporterId: string;
    reporter?: User;
    targetId: string;
    targetType: 'event' | 'user' | 'plan';
    createdAt: string;
}

export const adminApi = {
    // Stats
    getStats: async (): Promise<AdminStats> => {
        const response = await apiClient.get('/admin/stats');
        return response.data;
    },

    // Users
    getUsers: async (role?: string): Promise<User[]> => {
        const response = await apiClient.get('/admin/users', { params: { role } });
        return response.data;
    },

    updateUserRole: async (userId: string, role: string): Promise<User> => {
        const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
        return response.data;
    },

    // Events
    getPendingEvents: async (): Promise<Event[]> => {
        const response = await apiClient.get('/admin/events/pending');
        return response.data;
    },

    updateEventStatus: async (eventId: string, status: 'approved' | 'rejected'): Promise<Event> => {
        const response = await apiClient.put(`/admin/events/${eventId}/status`, { status });
        return response.data;
    },

    toggleEventFeature: async (eventId: string, isFeatured: boolean): Promise<Event> => {
        const response = await apiClient.put(`/admin/events/${eventId}/feature`, { isFeatured });
        return response.data;
    },

    // Organizers
    getOrganizerApplications: async (status?: string): Promise<any[]> => {
        const response = await apiClient.get('/admin/organizers/applications', { params: { status } });
        return response.data;
    },

    handleOrganizerApplication: async (applicationId: string, status: 'approved' | 'rejected', adminComment?: string): Promise<any> => {
        const response = await apiClient.post(`/admin/organizers/applications/${applicationId}/handle`, { status, adminComment });
        return response.data;
    },

    // Reports
    getReports: async (status?: string): Promise<AdminReport[]> => {
        const response = await apiClient.get('/admin/reports', { params: { status } });
        return response.data;
    },

    updateReportStatus: async (reportId: string, status: string): Promise<AdminReport> => {
        const response = await apiClient.put(`/admin/reports/${reportId}/status`, { status });
        return response.data;
    },

    // Categories
    getCategories: async (): Promise<Category[]> => {
        const response = await apiClient.get('/admin/categories');
        return response.data;
    },

    createCategory: async (data: { name: string, icon?: string }): Promise<Category> => {
        const response = await apiClient.post('/admin/categories', data);
        return response.data;
    },

    updateCategory: async (id: number, data: Partial<Category>): Promise<Category> => {
        const response = await apiClient.put(`/admin/categories/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/categories/${id}`);
    },
};
