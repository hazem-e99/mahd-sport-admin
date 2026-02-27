import type { PaginatedApiResponse } from '@/types/api-response';
import apiClient from '../../axiosClient';
import type { ConflictDeclaration } from '@/types/ConflictDeclaration.type';
import { CONFLICT_DECLARATIONS_API } from '../endpoints/ConflictDeclarations';

const handleApiError = (error: unknown): never => {
  const errorObj = error as { response?: { data?: { message?: string } }; message?: string };
  if (errorObj.response?.data?.message) {
    throw new Error(errorObj.response.data.message);
  }
  if (errorObj.message) {
    throw new Error(errorObj.message);
  }
  throw new Error('An unexpected error occurred');
};

export const ConflictDeclarationService = {

  getAllConflictDeclarations: async (
    params?: {
      pageNumber?: number;
      pageSize?: number;
      descriptionText?: string;
      notificationMessage?: string;
      sortBy?: string;
      sortDirection?: 'asc' | 'desc';
    }
  ): Promise<PaginatedApiResponse<ConflictDeclaration>> => {
    try {
      const queryParams = new URLSearchParams();

      // Pagination
      queryParams.append('Pagination.PageNumber', (params?.pageNumber ?? 1).toString());
      queryParams.append('Pagination.PageSize', (params?.pageSize ?? 10).toString());

      // Filters
      if (params?.descriptionText) {
        queryParams.append('ConflictDeclarationFilterDto.DescriptionText', params.descriptionText);
      }
      if (params?.notificationMessage) {
        queryParams.append('ConflictDeclarationFilterDto.NotificationMessage', params.notificationMessage);
      }

      // Sorting
      if (params?.sortBy) {
        queryParams.append('SortByColumn.sortBy', params.sortBy);
      }
      if (params?.sortDirection) {
        queryParams.append('SortByColumn.sortDirection', params.sortDirection);
      }

      const url = `${CONFLICT_DECLARATIONS_API.getConflictDeclarations}?${queryParams.toString()}`;
      const response = await apiClient.get<PaginatedApiResponse<ConflictDeclaration>>(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createConflictDeclaration: async (notificationData: Omit<ConflictDeclaration, 'id'>): Promise<ConflictDeclaration> => {
    try {
      const response = await apiClient.post<ConflictDeclaration>(CONFLICT_DECLARATIONS_API.create, notificationData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteConflictDeclaration: async (id: string | number): Promise<void> => {
    try {
      const res = await apiClient.delete(CONFLICT_DECLARATIONS_API.delete(id));
      console.log("🚀 ~ res:", res)

      return res.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  exportConflictDeclarations: async () => {
    try {
      const response = await apiClient.get(CONFLICT_DECLARATIONS_API.exportConflictDeclarations);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  exportViewers: async (id: string | number) => {
    try {
      const response = await apiClient.get(CONFLICT_DECLARATIONS_API.exportViewers, {
        params: { ConflictDeclarationId: id }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};