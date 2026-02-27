import type { PaginatedApiResponse } from '@/types/api-response';
import type { 
  EventItem, 
  EventCategory, 
  EventApiParams, 
  EventCategoryApiParams,
  EventFormInputs,
  EventCategoryFormInputs 
} from '@/types/operational-calendar.type';
import axios from "axios";
import apiClient from "../../axiosClient";

interface ErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
  errors?: Record<string, string[]>;
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
    message: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
  };
};

// API endpoints
const EVENTS_API = {
  getAll: "/OperationalCalendarsApi/GetAll",
  getById: (id: string | number) =>
    `/OperationalCalendarsApi/GetDetails?Id=${id}`,
  create: "/OperationalCalendarsApi/Create",
  update: `/OperationalCalendarsApi/Update`,
  delete: (id: string | number) => `/OperationalCalendarsApi/Delete?id=${id}`,
  getCategories: "/OperationalCalendarCategoriesApi/GetDictionary",
};

const EVENT_CATEGORIES_API = {
  getAll: "/OperationalCalendarCategoriesApi/GetAll",
  getById: (id: string | number) => `/OperationalCalendarCategoriesApi/GetDetails?Id=${id}`,
  create: "/OperationalCalendarCategoriesApi/Create",
  update: "/OperationalCalendarCategoriesApi/Update",
  delete: (id: string | number) => `/OperationalCalendarCategoriesApi/Delete?id=${id}`,
};

export const OperationalCalendarService = {
  // Events CRUD operations
  getAllEvents: async (
    params: EventApiParams
  ): Promise<PaginatedApiResponse<EventItem>> => {
    try {
      const queryParams = new URLSearchParams();

      queryParams.append(
        "Pagination.PageNumber",
        params["Pagination.PageNumber"].toString()
      );
      queryParams.append(
        "Pagination.PageSize",
        params["Pagination.PageSize"].toString()
      );

      if (params["FilterDto.CategoryId"]) {
        queryParams.append(
          "FilterDto.CategoryId",
          params["FilterDto.CategoryId"].toString()
        );
      }

      if (params["FilterDto.VisibleTo"] !== undefined) {
        queryParams.append(
          "FilterDto.VisibleTo",
          params["FilterDto.VisibleTo"].toString()
        );
      }

      if (params["FilterDto.Title"]) {
        queryParams.append("FilterDto.Title", params["FilterDto.Title"]);
      }

      if (params["SortByColumn.sortDirection"]) {
        queryParams.append("SortByColumn.sortDirection", params["SortByColumn.sortDirection"]);
      }

      if (params["FilterDto.StartDateFrom"]) {
        queryParams.append("FilterDto.StartDateFrom", params["FilterDto.StartDateFrom"]);
      }
      
      if (params["FilterDto.EndDateTo"]) {
        queryParams.append("FilterDto.EndDateTo", params["FilterDto.EndDateTo"]);
      }

      const response = await apiClient.get(
        `${EVENTS_API.getAll}?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getEventById: async (id: string | number): Promise<EventItem> => {
    try {
      const response = await apiClient.get(EVENTS_API.getById(id));
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createEvent: async (data: EventFormInputs): Promise<EventItem> => {
    try {
      const response = await apiClient.post(EVENTS_API.create, data);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateEvent: async (
    id: string | number,
    data: Partial<EventFormInputs>
  ): Promise<EventItem> => {
    try {
      const response = await apiClient.put(EVENTS_API.update, { ...data, id });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteEvent: async (id: string | number): Promise<void> => {
    try {
      await apiClient.delete(EVENTS_API.delete(id));
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getEventCategories: async (): Promise<EventCategory[]> => {
    try {
      const response = await apiClient.get(EVENTS_API.getCategories);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Event Categories CRUD operations
  getAllEventCategories: async (
    params: EventCategoryApiParams
  ): Promise<PaginatedApiResponse<EventCategory>> => {
    try {
      const queryParams = new URLSearchParams();

      queryParams.append(
        "Pagination.PageNumber",
        params["Pagination.PageNumber"].toString()
      );
      queryParams.append(
        "Pagination.PageSize",
        params["Pagination.PageSize"].toString()
      );

      if (params["SortByColumn.sortDirection"]) {
        queryParams.append("SortByColumn.sortDirection", params["SortByColumn.sortDirection"]);
      }

      if (params.searchTerm) {
        queryParams.append("searchTerm", params.searchTerm);
      }

      const response = await apiClient.get(
        `${EVENT_CATEGORIES_API.getAll}?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getEventCategoryById: async (id: string | number): Promise<EventCategory> => {
    try {
      const response = await apiClient.get(EVENT_CATEGORIES_API.getById(id));
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createEventCategory: async (
    data: EventCategoryFormInputs
  ): Promise<EventCategory> => {
    try {
      const response = await apiClient.post(EVENT_CATEGORIES_API.create, data);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateEventCategory: async (
    id: string | number,
    data: Partial<EventCategoryFormInputs>
  ): Promise<EventCategory> => {
    try {
      const response = await apiClient.put(
        EVENT_CATEGORIES_API.update,
        { ...data, id }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteEventCategory: async (id: string | number): Promise<void> => {
    try {
      await apiClient.delete(EVENT_CATEGORIES_API.delete(id));
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
