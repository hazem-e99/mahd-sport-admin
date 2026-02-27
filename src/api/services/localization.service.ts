import apiClient from "@/axiosClient";
import { LOCALIZATION_API } from "../endpoints/localization";

export interface LocalizationItem {
  key: string;
  value: string;
  culture: string;
}

export interface LocalizationFilter {
  culture: string;
}

export interface LocalizationEntry {
  value: string;
  culture: string;
}

export interface CreateLocalizationRequest {
  key: string;
  localizationEntries: LocalizationEntry[];
}

export interface CreateLocalizationResponse {
  data: any;
  success: boolean;
  message: string;
}

export interface UpdateLocalizationRequest {
  key: string;
  localizationEntries: LocalizationEntry[];
}

export interface UpdateLocalizationResponse {
  data: any;
  success: boolean;
  message: string;
}

const handleApiError = (error: any): Error => {
  return {
    message: error?.response?.data?.message || "حدث خطأ غير متوقع",
  } as Error;
};

export const LocalizationService = {
  getAll: async (filter?: LocalizationFilter): Promise<LocalizationItem[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filter?.culture) {
        queryParams.append("localizationFilter.culture", filter.culture);
      }

      const url = filter?.culture 
        ? `${LOCALIZATION_API.getAll}?${queryParams.toString()}`
        : LOCALIZATION_API.getAll;
      const response = await apiClient.get<LocalizationItem[]>(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAllGrouped: async (): Promise<Record<string, LocalizationItem[]>> => {
    try {
      const response = await apiClient.get<LocalizationItem[]>(LOCALIZATION_API.getAll);
      const groupedData: Record<string, LocalizationItem[]> = {};
      
      response.data.forEach(item => {
        if (!groupedData[item.key]) {
          groupedData[item.key] = [];
        }
        groupedData[item.key].push(item);
      });
      
      return groupedData;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  create: async (
    data: CreateLocalizationRequest
  ): Promise<CreateLocalizationResponse> => {
    try {
      const response = await apiClient.post<CreateLocalizationResponse>(
        LOCALIZATION_API.create,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  update: async (
    data: UpdateLocalizationRequest
  ): Promise<UpdateLocalizationResponse> => {
    try {
      const response = await apiClient.post<UpdateLocalizationResponse>(
        LOCALIZATION_API.update,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
