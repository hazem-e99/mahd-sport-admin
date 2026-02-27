import apiClient from "@/axiosClient";
import axios from "axios";
import type { DictionaryItem, WidgetCategoryResponse } from "../api-type/api-type";
import { TabWidgetCategoriesApi_Api } from "../endpoints/TabWidgetCategoriesApi";

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

export const TabWidgetCategoriesService = {
  getTabWidgetCategories: async (): Promise<DictionaryItem[]> => {
    try {
      const response = await apiClient.get<DictionaryItem[]>(TabWidgetCategoriesApi_Api.getDictionary);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getTabWidgetCategoriesWithWidgets: async (): Promise<WidgetCategoryResponse[]> => {
    try {
      const response = await apiClient.get<WidgetCategoryResponse[]>(TabWidgetCategoriesApi_Api.getDictionaryWithWidgets);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
