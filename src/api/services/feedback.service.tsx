import axios from 'axios';
import apiClient from '../../axiosClient';
import type {
  ApiResponse,
  FeedbackDetailsResponse,
  FeedbackListRequest,
  FeedbackListResponse,
  FeedbackRatingsRequest,
  FeedbackRatingsResponse
} from '../../types/feedback-ratings.type';
import { DEPARTMENT_API, FEEDBACK_API } from '../endpoints/feedback';

interface ErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
  errors?: string[];
}
export interface Department {
  id: string;
  name: string;
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

export const feedbackService = {
  // Get feedback ratings with optional date filters
  getFeedbackRatings: async (params?: FeedbackRatingsRequest): Promise<ApiResponse<FeedbackRatingsResponse>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.fromDate) {
        queryParams.append('FromDate', params.fromDate);
      }
      if (params?.toDate) {
        queryParams.append('ToDate', params.toDate);
      }

      const url = queryParams.toString()
        ? `${FEEDBACK_API.getFeedbackRatings}?${queryParams.toString()}`
        : FEEDBACK_API.getFeedbackRatings;

      const response = await apiClient.get<ApiResponse<FeedbackRatingsResponse>>(url);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  // Get feedback list with pagination and optional date and department filters
  getFeedbacks: async (params?: FeedbackListRequest): Promise<FeedbackListResponse> => {
    try {
      const queryParams = new URLSearchParams();

      if (params?.pageNumber) {
        queryParams.append('Pagination.PageNumber', params.pageNumber.toString());
      }
      if (params?.pageSize) {
        queryParams.append('Pagination.PageSize', params.pageSize.toString());
      }
      if (params?.fromDate) {
        queryParams.append('FeedbacksFilterDto.FromDate', params.fromDate);
      }
      if (params?.toDate) {
        queryParams.append('FeedbacksFilterDto.ToDate', params.toDate);
      }
      if (params?.department) {
        queryParams.append('FeedbacksFilterDto.Department', params.department);
      }

      const url = queryParams.toString()
        ? `${FEEDBACK_API.getFeedbacks}?${queryParams.toString()}`
        : FEEDBACK_API.getFeedbacks;

      const response = await apiClient.get<FeedbackListResponse>(url);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  // Get feedback details by ID
  getFeedbackDetails: async (id: number): Promise<FeedbackDetailsResponse> => {
    try {
      const url = FEEDBACK_API.getFeedbackDetails(id);
      const response = await apiClient.get<FeedbackDetailsResponse>(url);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  // Delete feedback by ID
  deleteFeedback: async (id: number): Promise<ApiResponse<boolean>> => {
    try {
      const url = FEEDBACK_API.deleteFeedback(id);
      const response = await apiClient.delete<ApiResponse<boolean>>(url);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  getDictionary: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get(DEPARTMENT_API.getDictionary);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw error;
    }
  },

  // Export feedbacks to Excel
  exportFeedbacks: async (params?: { fromDate?: string; toDate?: string; department?: string }): Promise<any> => {
    const queryParams = new URLSearchParams();

    if (params?.fromDate) queryParams.append('FromDate', params.fromDate);
    if (params?.toDate) queryParams.append('ToDate', params.toDate);
    if (params?.department) queryParams.append('Department', params.department);

    const url = `${FEEDBACK_API.exportFeedbacks}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await apiClient.get(url);
    return response.data;
  },
};