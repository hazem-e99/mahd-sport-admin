import apiClient from "@/axiosClient";
import type { DictionaryItem } from "../api-type/api-type";
import { AppRoles_Api } from "../endpoints/AppRolesApi";
import axios from "axios";

export type ApiError = {
  message: string;
  statusCode?: number;
  error?: string;
};

const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      statusCode: error.response?.status,
      error: error.code,
    };
  }
  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
  };
};

export const RoleService = {
  getAppRoles: async (): Promise<DictionaryItem[]> => {
    try {
      const response = await apiClient.get<DictionaryItem[]>(AppRoles_Api.getDictionary);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getAllRoles: async (pageNumber: number = 1, pageSize: number = 10, searchTerm?: string) => {
    try {
      const params = new URLSearchParams();
      params.append('Pagination.PageNumber', String(pageNumber));
      params.append('Pagination.PageSize', String(pageSize));
      if (searchTerm) params.append('Filter.Name', searchTerm);
      const response = await apiClient.get(`${AppRoles_Api.getAll}?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getRoleDetails: async (roleId: number | string) => {
    try {
      const response = await apiClient.get(AppRoles_Api.getRoleDetails(roleId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  assignActionsToRole: async (roleId: number | string, actionIds: string[]) => {
    try {
      const response = await apiClient.post(AppRoles_Api.assignActionsToRole, { roleId, actionIds });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
