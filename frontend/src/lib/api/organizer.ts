import { apiClient } from './client';
import { Event } from '@/types';

export const organizerApi = {
    apply: async (data: { reason: string; organizationName?: string }) => {
        const response = await apiClient.post('/organizer/apply', data);
        return response.data;
    },

    getProfile: async (id: string) => {
        const response = await apiClient.get(`/organizer/${id}`);
        return response.data;
    },

    getOrganizerEvents: async (id: string): Promise<Event[]> => {
        const response = await apiClient.get(`/organizer/${id}/events`);
        return response.data;
    },

    updateProfile: async (data: any) => {
        const response = await apiClient.put('/organizer/profile', data);
        return response.data;
    },

    requestFeature: async (eventId: string) => {
        const response = await apiClient.post(`/organizer/events/${eventId}/feature`);
        return response.data;
    }
};
