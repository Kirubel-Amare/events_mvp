import { apiClient } from './client';
import { Event, Category } from '@/types';

export interface GetEventsParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    city?: string;
    isFeatured?: boolean;
    sort?: string;
    order?: 'ASC' | 'DESC';
}

export interface CreateEventData {
    title: string;
    description: string;
    date: string;
    city: string;
    images: string[];
    mainImage?: string | null;
    price?: string;
    capacity?: number;
    externalLink?: string;
    categoryId?: number;
}

export const eventsApi = {
    // Get all events with filters
    getEvents: async (params?: GetEventsParams): Promise<{ events: Event[]; total: number; page: number; limit: number; totalPages: number }> => {
        const response = await apiClient.get('/events', { params });
        return response.data;
    },

    // Get single event
    getEvent: async (id: string): Promise<Event> => {
        const response = await apiClient.get(`/events/${id}`);
        return response.data;
    },

    // Create event
    createEvent: async (data: CreateEventData): Promise<Event> => {
        const response = await apiClient.post('/events', data);
        return response.data;
    },

    // Get featured events
    getFeaturedEvents: async (): Promise<Event[]> => {
        const response = await apiClient.get('/events/featured');
        return response.data;
    },

    // Get categories
    getCategories: async (): Promise<Category[]> => {
        const response = await apiClient.get('/events/categories');
        return response.data;
    },

    // Join event
    joinEvent: async (id: string, message?: string) => {
        const response = await apiClient.post(`/events/${id}/apply`, { message });
        return response.data;
    },

    // Leave event
    leaveEvent: async (id: string) => {
        const response = await apiClient.delete(`/events/${id}/apply`);
        return response.data;
    },

    // Get event applications
    getApplications: async (id: string) => {
        const response = await apiClient.get(`/events/${id}/applications`);
        return response.data;
    }
};
