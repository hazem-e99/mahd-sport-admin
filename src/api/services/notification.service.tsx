import type { PaginatedApiResponse } from '@/types/api-response';
import type { Notification } from '@/types/notification.type';
import apiClient from '../../axiosClient';
import { NOTIFICATION_API } from '../endpoints/notification';
import axios from 'axios';

// const handleApiError = (error: unknown): never => {
//     const errorObj = error as { response?: { data?: { message?: string } }; message?: string };
//     if (errorObj.response?.data?.message) {
//         throw new Error(errorObj.response.data.message);
//     }
//     if (errorObj.message) {
//         throw new Error(errorObj.message);
//     }
//     throw new Error('An unexpected error occurred');
// };


interface ErrorResponse {
    message: string;
    statusCode?: number;
    error?: string;
    errors?: string[];
}

const handleApiError = (error: unknown): ErrorResponse => {
    if (axios.isAxiosError(error)) {
        return {
            message: error.response?.data?.message || error.response?.data?.Message + " " + error.response?.data?.errors?.[0]?.description,
            statusCode: error.response?.status,
            error: error.code,
            errors: error.response?.data?.errors || [],
        };
    }
    return {
        message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
    };
};

export const NotificationService = {
    getAllNotifications: async (
        params?: {
            pageNumber?: number;
            pageSize?: number;
            searchTerm?: string;
            audienceFilter?: string;
            statusFilter?: string;
            sortBy?: string;
            sortDirection?: 'asc' | 'desc';
        }
    ): Promise<PaginatedApiResponse<Notification>> => {
        try {
            const queryParams = new URLSearchParams();
            const pageNumber = params?.pageNumber ?? 1;
            const pageSize = params?.pageSize ?? 10;

            queryParams.append('PageNumber', pageNumber.toString());
            queryParams.append('PageSize', pageSize.toString());

            if (params?.searchTerm) {
                queryParams.append('Title', params.searchTerm);
            }
            if (params?.audienceFilter) {
                queryParams.append('Audience', params.audienceFilter);
            }
            if (params?.statusFilter) {
                queryParams.append('Status', params.statusFilter);
            }
            if (params?.sortBy) {
                queryParams.append('sortBy', params.sortBy);
            }
            if (params?.sortDirection) {
                queryParams.append('sortDirection', params.sortDirection);
            }

            const url = `${NOTIFICATION_API.getAll}?${queryParams.toString()}`;
            const response = await apiClient.get<PaginatedApiResponse<Notification>>(url);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getNotificationById: async (id: string | number): Promise<Notification> => {
        try {
            const response = await apiClient.get<{ data: Notification }>(NOTIFICATION_API.getById(id));
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    createNotification: async (notificationData: Omit<Notification, 'id'>): Promise<Notification> => {
        try {
            const response = await apiClient.post<Notification>(NOTIFICATION_API.create, notificationData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    updateNotification: async (id: string | number, notificationData: Partial<Notification>): Promise<Notification> => {
        try {
            const response = await apiClient.put<Notification>(NOTIFICATION_API.update, { ...notificationData, id: Number(id) });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    deleteNotification: async (id: string | number): Promise<{ success: boolean }> => {
        try {
            const response = await apiClient.delete<{ success: boolean }>(NOTIFICATION_API.delete(id));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }
}; 