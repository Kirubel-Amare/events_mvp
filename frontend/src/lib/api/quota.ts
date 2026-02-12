import { apiClient } from './client';

export interface CreateQuotaRequestData {
    type: 'event' | 'plan';
    requestedValue: number;
    reason: string;
}

export interface QuotaRequest {
    id: string;
    userId: string;
    type: 'event' | 'plan';
    requestedValue: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    adminComment: string | null;
    createdAt: string;
    updatedAt: string;
}

export const quotaApi = {
    // Submit a new quota request
    createRequest: async (data: CreateQuotaRequestData): Promise<QuotaRequest> => {
        const response = await apiClient.post('/quotas/request', data);
        return response.data;
    },

    // Get my quota requests
    getMyRequests: async (): Promise<QuotaRequest[]> => {
        const response = await apiClient.get('/quotas/my-requests');
        return response.data;
    },

    // Admin: Get all quota requests
    getAllRequests: async (): Promise<QuotaRequest[]> => {
        const response = await apiClient.get('/quotas/all');
        return response.data;
    },

    // Admin: Update request status
    updateRequestStatus: async (id: string, status: string, adminComment?: string): Promise<QuotaRequest> => {
        const response = await apiClient.patch(`/quotas/${id}/status`, { status, adminComment });
        return response.data;
    }
};
