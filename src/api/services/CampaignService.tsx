import type { PaginatedApiResponse } from '@/types/api-response';
import type { Campaign } from '@/types/campaign';
import axios from 'axios';
import apiClient from '../../axiosClient';
import { CAMPAIGN_API } from '../endpoints/campaign';
import type { ApiResponse, CampaignType, CampaignTypes, DictionaryItem } from '../api-type/api-type';

export interface CampaignDetails {
  id: number;
  name: string;
  campaignTypeId: number;
  campaignTypeName: string | null;
  startDate: string;
  endDate: string;
  visibleToId: number;
  visibleToName: string;
  description: string;
  image: string;
  link: string;
  statusName: string;
  allowedRoleIds: number[];
}

export interface CampaignDetailsResponse {
  success: boolean;
  data: CampaignDetails;
  message: string | null;
  errors: string[];
}

interface ErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
  errors?: string[];
}

const handleApiError = (error: unknown): ErrorResponse => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      statusCode: error.response?.status,
      error: error.code,
      errors: error.response?.data?.errors,
    };
  }
  return {
    message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
  };
};

export const CampaignService = {
  getAllCampaigns: async (
    params?: {
      pageNumber?: number;
      pageSize?: number;
      searchTerm?: string;
      visibilityFilter?: string; // "1" | "2" | "3"
      statusFilter?: string;
      typeFilter?: string;
      sortBy?: string;
      sortDirection?: 'asc' | 'desc';
    }
  ): Promise<PaginatedApiResponse<Campaign>> => {
    try {
      const queryParams = new URLSearchParams();
      const pageNumber = params?.pageNumber ?? 1;
      const pageSize = params?.pageSize ?? 10;
      queryParams.append('Pagination.PageNumber', pageNumber.toString());
      queryParams.append('Pagination.PageSize', pageSize.toString());
      queryParams.append('SortByColumn.sortDirection', "desc".toString());
      if (params?.searchTerm) queryParams.append('FilterDto.Name', params.searchTerm);
      if (params?.visibilityFilter) queryParams.append('FilterDto.Visiblity', params.visibilityFilter);
      if (params?.statusFilter) queryParams.append('FilterDto.Status', params.statusFilter);
      if (params?.typeFilter) queryParams.append('FilterDto.TypeId', params.typeFilter);
      if (params?.sortBy) queryParams.append('SortByColumn.sortBy', params.sortBy);
      if (params?.sortDirection) queryParams.append('SortByColumn.sortDirection', params.sortDirection);

      const url = `${CAMPAIGN_API.getAll}?${queryParams.toString()}`;
      const response = await apiClient.get<PaginatedApiResponse<Campaign>>(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getCampaignDetails: async (id: string | number): Promise<CampaignDetails> => {
    try {
      const response = await apiClient.get<CampaignDetailsResponse>(CAMPAIGN_API.getDetails(String(id)));
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createCampaign: async (campaignData: Omit<Campaign, 'id'>): Promise<Campaign> => {
    try {
      const response = await apiClient.post<Campaign>(CAMPAIGN_API.create, campaignData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateCampaign: async (id: string | number, campaignData: Partial<Campaign>): Promise<Campaign> => {
    try {
      const response = await apiClient.put<Campaign>(CAMPAIGN_API.update, { id, ...campaignData });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteCampaign: async (id: string | number): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.post<{ success: boolean }>(CAMPAIGN_API.delete, { id });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Dictionary methods
  getCampaignTypes: async (): Promise<CampaignType[]> => {
    try {
      const response = await apiClient.get<CampaignType[]>(CAMPAIGN_API.getCampaignTypes);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAppRoles: async (): Promise<DictionaryItem[]> => {
    try {
      const response = await apiClient.get<DictionaryItem[]>(CAMPAIGN_API.getAppRoles);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getVisibilityOptions: async (): Promise<DictionaryItem[]> => {
    try {
      const response = await apiClient.get(CAMPAIGN_API.getVisibilityOptions);
      return response.data?.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  addCampaignType: async (data: CampaignType) => {
    try {
      const response = await apiClient.post<CampaignType>(CAMPAIGN_API.addCampaignType, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getCampaignTypeDetails: async (id: string): Promise<ApiResponse<CampaignTypes>> => {
    try {
      const response = await apiClient.get<ApiResponse<CampaignTypes>>(CAMPAIGN_API.getCampaignTypeDetails(id));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateCampaignType: async (id: number, data: CampaignType): Promise<CampaignType> => {
    try {
      const response = await apiClient.put<CampaignType>(CAMPAIGN_API.updateCampaignType, { ...data, id });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteCampaignType: async (id: number) => {
    try {
      const response = await apiClient.post<CampaignType>(CAMPAIGN_API.deleteCampaignType, { id });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

};