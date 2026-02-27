import type { PaginatedApiResponse } from '@/types/api-response';
import type { TabConfig, TabFormInputs } from '@/types/shard-table.type';
import axios from 'axios';
import apiClient from '../../axiosClient';
import { TABS_API } from '../endpoints/tabs';
import { Comman_API } from '../endpoints/Comman';

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

export const TabsService = {
  getTabVisibilityList: async () => {
    try {
      const response = await apiClient.get(Comman_API.tabVisibility);
      return  { data: response.data.data };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAllTabs: async (
    params?: {
      pageNumber?: number;
      pageSize?: number;
      searchTerm?: string;
      visibility?: number;
      statusFilter?: number;
      sortBy?: string;
      sortDirection?: 'asc' | 'desc';
    }
  ) => {
    try {
      console.log("Current statusFilter:", params?.statusFilter);
      const queryParams = new URLSearchParams();
      const pageNumber = params?.pageNumber ?? 1;
      const pageSize = params?.pageSize ?? 10;
      queryParams.append('Pagination.PageNumber', pageNumber.toString());
      queryParams.append('Pagination.PageSize', pageSize.toString());
      if (params?.searchTerm) queryParams.append('TabFilterDto.Name', params.searchTerm);
      if (params?.visibility) queryParams.append('TabFilterDto.Visiblity', params.visibility.toString());
      if (params?.statusFilter==1||params?.statusFilter==0) queryParams.append('TabFilterDto.Status', params.statusFilter.toString());
      if (params?.sortBy) queryParams.append('SortByColumn.sortBy', params.sortBy);
      if (params?.sortDirection) queryParams.append('SortByColumn.sortDirection', params.sortDirection);

      const response = await apiClient.get<PaginatedApiResponse<TabConfig>>
        (`${TABS_API.getAll}?${queryParams.toString()}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch tabs');
      }

      return {
        data: response.data.data.items,
        totalCount: response.data.data.totalCount,
        currentPage: response.data.data.pageNumber,
        totalPages: response.data.data.totalPages,
        hasNextPage: response.data.data.hasNextPage,
        hasPreviousPage: response.data.data.hasPreviousPage
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createTab: async (tabData: Omit<TabFormInputs, 'id'>) => {
    try {
      const response = await apiClient.post(TABS_API.create, tabData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateTab: async (id: string, tabData: Partial<TabConfig>) => {
    try {
      const response = await apiClient.put(TABS_API.update, { id, ...tabData });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteTab: async (id: string) => {
    try {
      const response = await apiClient.post(TABS_API.delete, { id });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getTabDetails: async (id: string) => {
    try {
      const response = await apiClient.get(`${TABS_API.getDetails(id)}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};
