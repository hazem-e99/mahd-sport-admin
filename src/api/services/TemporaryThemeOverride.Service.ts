import type { PaginatedApiResponse } from '@/types/api-response';
import axios from 'axios';
import apiClient from '../../axiosClient';
import { TEMPORARY_THEME_OVERRIDES_API } from '../endpoints/TemporaryThemeOverrides';
import type { TemporaryThemeOverride } from '@/types/TemporaryThemeOverride.type';
 

interface ErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
}

const handleApiError = (error: unknown): ErrorResponse => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      statusCode: error.response?.status,
      error: error.code,
    };
  }
  return {
    message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
  };
};

export const TemporaryThemeOverrideService = {
  getAllOverrides: async (
    params?: {
      pageNumber?: number;
      pageSize?: number;
      holidayName?: string;
      sortBy?: string;
      sortDirection?: 'asc' | 'desc';
    }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('Pagination.PageNumber', (params?.pageNumber ?? 1).toString());
      queryParams.append('Pagination.PageSize', (params?.pageSize ?? 10).toString());

      if (params?.holidayName) {
        queryParams.append('GeneralSettingTemporaryThemeOverrideFilterDto.HolidayName', params.holidayName);
      }

      if (params?.sortBy) {
        queryParams.append('SortByColumn.sortBy', params.sortBy);
      }

      if (params?.sortDirection) {
        queryParams.append('SortByColumn.sortDirection', params.sortDirection);
      }

      const response = await apiClient.get<PaginatedApiResponse<TemporaryThemeOverride>>(
        `${TEMPORARY_THEME_OVERRIDES_API.getAll}?${queryParams.toString()}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch overrides');
      }

      return {
        data: response.data.data.items,
        totalCount: response.data.data.totalCount,
        currentPage: response.data.data.pageNumber,
        totalPages: response.data.data.totalPages,
        hasNextPage: response.data.data.hasNextPage,
        hasPreviousPage: response.data.data.hasPreviousPage,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

 createOverride: async (data: any) => {
  try {
    const response = await apiClient.post(TEMPORARY_THEME_OVERRIDES_API.create, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
},

updateOverride: async (data: any) => {
  try {
    const response = await apiClient.put(TEMPORARY_THEME_OVERRIDES_API.update, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
},

  deleteOverride: async (id: string) => {
    try {
      const response = await apiClient.post(TEMPORARY_THEME_OVERRIDES_API.delete, { id });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
