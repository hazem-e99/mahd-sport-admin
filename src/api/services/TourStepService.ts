import { TourStep_API } from '@/api/endpoints/TourStep';
import apiClient from '@/axiosClient';
import type {
    ApiEnvelope,
    TourStep,
    TourStepCreatePayload,
    TourStepUpdatePayload,
} from '@/types/tour-step.type';

type PaginatedApiResponse<T> = {
  success: boolean;
  data: {
    items: T[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  message?: string | null;
  errors?: unknown[];
};

export const TourStepService = {
  getAll: async (
    params?: {
      pageNumber?: number;
      pageSize?: number;
      searchTerm?: string;                 
      sortBy?: 'id' | 'titleLa' | 'title' | 'messageLa' | 'message';
      sortDirection?: 'asc' | 'desc';
    }
  ) => {
    try {
      const queryParams = new URLSearchParams();

      const pageNumber = params?.pageNumber ?? 1;
      const pageSize = params?.pageSize ?? 10;

      queryParams.append('Pagination.PageNumber', pageNumber.toString());
      queryParams.append('Pagination.PageSize', pageSize.toString());
      if (params?.searchTerm) queryParams.append('FilterDto.SearchTerm', params.searchTerm);
      if (params?.sortBy) queryParams.append('SortByColumn.sortBy', params.sortBy);
      if (params?.sortDirection) queryParams.append('SortByColumn.sortDirection', params.sortDirection);

      const url = `${TourStep_API.getAll}?${queryParams.toString()}`;

      const response = await apiClient.get<PaginatedApiResponse<TourStep>>(url);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch tour steps');
      }

      const p = response.data.data;
      return {
        data: p.items,
        totalCount: p.totalCount,
        currentPage: p.pageNumber,
        totalPages: p.totalPages,
        hasNextPage: p.hasNextPage,
        hasPreviousPage: p.hasPreviousPage,
      };
    } catch (err) { 
      const e = err as Error;
      throw new Error(e.message || 'Failed to fetch tour steps');
    }
  },

  getById: async (id: number | string): Promise<TourStep> => {
    try {
      const url = TourStep_API.getDetails(id);
      const { data } = await apiClient.get<ApiEnvelope<TourStep>>(url);
      
      if (!data?.success) {
        throw new Error(data?.message || 'Failed to fetch tour step');
      }
      
      return data.data;
    } catch (err) {
      const e = err as Error;
      throw new Error(e.message || 'Failed to fetch tour step');
    }
  },

  async create(payload: TourStepCreatePayload): Promise<TourStep> {
    const { data } = await apiClient.post<ApiEnvelope<TourStep>>(TourStep_API.create, payload);
    if (!data?.success) throw new Error(data?.message || 'Failed to create tour step');
    return data.data;
  },

  async update(payload: TourStepUpdatePayload): Promise<TourStep> {
    const { data } = await apiClient.put<ApiEnvelope<TourStep>>(TourStep_API.update, payload);
    if (!data?.success) throw new Error(data?.message || 'Failed to update tour step');
    return data.data;
  },

 async remove(id: number): Promise<void> {
    try { 
      const { data } = await apiClient.delete<ApiEnvelope<null | boolean>>(
        TourStep_API.delete,
        { data: { id } }
      );
      if (!data?.success) {
        throw new Error(data?.message || 'Failed to delete tour step');
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 405 || status === 415 || status === 500) {
        const { data } = await apiClient.post<ApiEnvelope<null | boolean>>(
          TourStep_API.delete,
          { id }
        );
        if (!data?.success) {
          throw new Error(data?.message || 'Failed to delete tour step');
        }
        return;
      }
      throw err;
    }
  },
};
