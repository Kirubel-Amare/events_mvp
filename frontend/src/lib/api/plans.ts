import { apiClient } from './client';
import { Plan } from '@/types';

export interface CreatePlanData {
    title: string;
    description: string;
    date: string;
    location: string;
    externalLink?: string;
}

export const plansApi = {
    // Get all plans
    getPlans: async (): Promise<Plan[]> => {
        const response = await apiClient.get('/plans');
        return response.data;
    },

    // Get single plan
    getPlan: async (id: string): Promise<Plan> => {
        const response = await apiClient.get(`/plans/${id}`);
        return response.data;
    },

    // Create plan
    createPlan: async (data: CreatePlanData): Promise<Plan> => {
        const response = await apiClient.post('/plans', data);
        return response.data;
    },

    // Join plan
    joinPlan: async (id: string, message?: string) => {
        const response = await apiClient.post(`/plans/${id}/apply`, { message });
        return response.data;
    },

    // Leave plan
    leavePlan: async (id: string) => {
        const response = await apiClient.delete(`/plans/${id}/apply`);
        return response.data;
    },

    // Get plan applications
    getApplications: async (id: string) => {
        const response = await apiClient.get(`/plans/${id}/applications`);
        return response.data;
    }
};
