import { apiClient } from './client';
import { Plan } from '@/types';

export interface CreatePlanData {
    title: string;
    description: string;
    date: string;
    location: string;
    image?: string | null;
    externalLink?: string;
}

export interface GetPlansParams {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    dateFrom?: string;
    dateTo?: string;
}

export const plansApi = {
    // Get all plans
    getPlans: async (params?: GetPlansParams): Promise<{ plans: Plan[]; total: number; page: number; limit: number; totalPages: number }> => {
        const response = await apiClient.get('/plans', { params });
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
