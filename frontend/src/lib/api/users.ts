import { apiClient } from './client';
import { User, Plan } from '@/types';

export interface Application {
    id: string;
    userId: string;
    eventId?: string;
    planId?: string;
    status: string;
    message?: string;
    appliedAt: string;
    createdAt: string;
    type: 'event' | 'plan' | 'organizer';
    event?: any; // Define Event type if imported
    plan?: Plan;
    reason?: string;
    organizationName?: string;
}

export const usersApi = {
    // Get user profile
    getProfile: async (username: string) => {
        const response = await apiClient.get(`/users/${username}`);
        return response.data;
    },

    // Get my applications
    getApplications: async (): Promise<Application[]> => {
        const response = await apiClient.get('/users/applications');
        return response.data;
    },

    // Get user plans
    getUserPlans: async (userId: string): Promise<Plan[]> => {
        const response = await apiClient.get(`/users/${userId}/plans`);
        return response.data;
    },

    // Update profile
    updateProfile: async (data: { name?: string; bio?: string; city?: string; profilePhoto?: string }) => {
        const response = await apiClient.put('/users/profile', data);
        return response.data;
    }
};
