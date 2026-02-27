import apiClient from "@/axiosClient";
import { GENERALL_SETTINGS_API } from "../endpoints/general-settings";

export interface TimeZoneDictionary {
  key: string;
  value: string;
}

export interface GeneralSettings {
  success: boolean;
  data: GeneralSettingsData;
  message: null;
  errors: any[];
}

interface GeneralSettingsBase {
  defaultLanguage: string;
  defaultTimeZone: string;
  defaultMode: string;
  introVideoPath: string;
  birthdayCelebration?: boolean;
  joiningCelebration?: boolean;
  lightThemeColors: GeneralSettingsColor[];
  darkThemeColors: GeneralSettingsColor[];
}

export interface GeneralSettingsData extends GeneralSettingsBase {
  backgrounds: GeneralSettingsColor[];
}

export interface GeneralSettingsDataUpdate extends GeneralSettingsBase {
  themeBackgrounds: GeneralSettingsColor[];
}

export interface GeneralSettingsColor {
  name: string;
  nameLa: string;
  path?: string;
  isDefault: boolean;
  hexCode?: string;
}

export interface ColorDictionary {
  key: string;
  value: string;
}

export interface UpdateGeneralSettingsResponse {
  success: boolean;
  data: number;
  message: null;
  errors: any[];
}

export const GeneralSettingsService = {
  getTimeZoneDictionary: async (): Promise<TimeZoneDictionary[]> => {
    const response = await apiClient.get(
      GENERALL_SETTINGS_API.getTimeZoneDictionary
    );
    return response.data;
  },
  getColorDictionary: async (): Promise<ColorDictionary[]> => {
    const response = await apiClient.get(
      GENERALL_SETTINGS_API.getColorDictionary
    );
    return response.data;
  },
  getGeneralSettings: async (): Promise<GeneralSettings> => {
    const response = await apiClient.get(
      GENERALL_SETTINGS_API.getGeneralSettings
    );
    return response.data;
  },
  update: async (
    data: GeneralSettingsDataUpdate
  ): Promise<UpdateGeneralSettingsResponse> => {
    const response = await apiClient.put(GENERALL_SETTINGS_API.update, data);
    return response.data;
  },
};
