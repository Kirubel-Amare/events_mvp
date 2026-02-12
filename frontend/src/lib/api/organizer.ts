import { apiClient } from './client';
import { Event } from '@/types';

export const organizerApi = {
    apply: async (data: { reason: string; organizationName?: string }) => {
        const response = await apiClient.post('/organizers/apply', data);
        return response.data;
    },

    getStats: async (id: string) => {
        const response = await apiClient.get(`/organizers/${id}/stats`);
        return response.data;
    },

    getProfile: async (id: string) => {
        const response = await apiClient.get(`/organizers/${id}`);
        return response.data;
    },

    getOrganizerEvents: async (id: string): Promise<Event[]> => {
        const response = await apiClient.get(`/organizers/${id}/events`);
        return response.data;
    },

    updateProfile: async (data: Record<string, any>) => {
        const response = await apiClient.put('/organizers/profile', data);
        return response.data;
    },

    requestFeature: async (eventId: string) => {
        const response = await apiClient.post(`/organizers/events/${eventId}/feature`);
        return response.data;
    }
};
