import apiClient from "@/axiosClient";
import type { CreateSurveyPayload, UpdateSurveyPayloadBody } from "@/pages/add-User-Survey/mappers";
import axios from "axios";
import { UserSurveys_API } from "../endpoints/UserSurvey";

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

export const SurveyService = {
  getAllUserSurveys: async (params?: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    status?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }) => {
    try {
      const {
        pageNumber = 1,
        pageSize = 10,
        searchTerm,
        status,
        sortBy,
        sortDirection
      } = params || {};

      const queryParams = new URLSearchParams();
      queryParams.append('Pagination.PageNumber', pageNumber.toString());
      queryParams.append('Pagination.PageSize', pageSize.toString());
      if (searchTerm) queryParams.append('FilterDto.Name', searchTerm);
      if (status !== undefined) queryParams.append('FilterDto.Status', status.toString());
      if (sortBy) queryParams.append('SortByColumn.sortBy', sortBy);
      if (sortDirection) queryParams.append('SortByColumn.sortDirection', sortDirection);

      const response = await apiClient.post(
        `${UserSurveys_API.getAll}?${queryParams.toString()}`
      );

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
  createSurvey: async (payload: CreateSurveyPayload) => {
    const response = await apiClient.post(UserSurveys_API.create, payload);
    return response.data;
  },

  updateSurvey: async (id: number, payload: UpdateSurveyPayloadBody) => {
    const body = { id, ...payload };
    const response = await apiClient.post(UserSurveys_API.update, body);
    return response.data;
  },
  getSurveyDetails: async (id: string) => {
    const response = await apiClient.post(UserSurveys_API.getDetails(id));
    return response.data;
  },
  deleteSurvey: async (id: string) => {
    try {
      const response = await apiClient.delete(`${UserSurveys_API.delete}/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getSurveyCount: async () => {
    try {
      const response = await apiClient.get('/SurveysApi/GetSurveyCount');

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch survey count');
      }

      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  exportSurveys: async (params?: { searchTerm?: string; status?: number }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.searchTerm) queryParams.append('FilterDto.Name', params.searchTerm);
      if (params?.status !== undefined) queryParams.append('FilterDto.Status', params.status.toString());

      const url = queryParams.toString()
        ? `${UserSurveys_API.exportSurveys}?${queryParams.toString()}`
        : UserSurveys_API.exportSurveys;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  exportSurveyResponses: async (params: { surveyId: number, searchTerm?: string }) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('surveyId', params.surveyId.toString());
      if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);

      const url = `${UserSurveys_API.exportSurveyResponses}?${queryParams.toString()}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};
