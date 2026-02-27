import apiClient from "@/axiosClient";
import type { PaginatedData, } from '@/types/api-response';
import { FAQ_API } from "../endpoints/faq";

interface FaqApiParams {
  'Pagination.PageNumber': number;
  'Pagination.PageSize': number;
  'FaqFilterDto.IsActive'?: boolean;
  'FaqFilterDto.FaqCategoryId'?: number;
}


interface FaqItem {
  id: number;
  name: string;
  nameLa: string;
}

export interface FaqCategory {
  id: number;
  arabicName: string;
  englishName: string;
}

export interface FaqCategoryFormData {
  arabicName: string;
  englishName: string;
}
interface FaqCreateUpdateData {
  id?: number;
  questionArabic?: string;
  questionEnglish?: string;
  descriptionArabic?: string;
  descriptionEnglish?: string;
  category?: { value: number; label: string } | null;
  status?: 'active' | 'inactive' | boolean;
}

export const FaqService = {
  getAll: async (params: FaqApiParams = {
    'Pagination.PageNumber': 1,
    'Pagination.PageSize': 10
  }): Promise<PaginatedData<FaqItem>> => {
    const response = await apiClient.get<PaginatedData<FaqItem>>(FAQ_API.getAll, { params });
    return response.data;
  },

  // getById: async (id: string) => {
  //   const response = await apiClient.get(FAQ_API.getById(id));
  //   return response.data;
  // },
  getById: async (id: string | number) => {
    const response = await apiClient.get(FAQ_API.getById(), {
      params: { id }
    });
    return response.data.data;
  },

  create: async (data: FaqCreateUpdateData) => {
    const response = await apiClient.post(FAQ_API.create, data);
    return response.data;
  },

  update: async (data: FaqCreateUpdateData) => {
    const response = await apiClient.put(FAQ_API.update, data);
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await apiClient.delete(FAQ_API.delete, { data: { id } });
    return response.data;
  },

  getCategories: async (): Promise<{ data: FaqItem[] }> => {
    const response = await apiClient.get<{ data: FaqItem[] }>(FAQ_API.getCategories);
    return response.data;
  },

  getCategoriesAll: async (): Promise<any[]> => {
    const response = await apiClient.get(FAQ_API.getCategoriesAll);
    return response.data;
  },

  createCategory: async (data: any): Promise<FaqCategory> => {
    const response = await apiClient.post<FaqCategory>(FAQ_API.createCategory, data);
    return response.data;
  },

  updateCategory: async (id: number, data: any): Promise<FaqCategory> => {
    const response = await apiClient.post<FaqCategory>(FAQ_API.updateCategory, { ...data, id });
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    const response = await apiClient.delete(FAQ_API.deleteCategory, { data: { id } });
    return response.data;
  }

};
export const FaqCategoryService = {
  getAll: async (): Promise<FaqCategory[]> => {
    const response = await apiClient.get('FaqCategoriesApi/GetAll');
    return response.data;
  },

  getById: async (id: number): Promise<FaqCategory> => {
    const response = await apiClient.get(`FaqCategoriesApi/GetById/${id}`);
    return response.data;
  },

  create: async (data: FaqCategoryFormData): Promise<FaqCategory> => {
    const response = await apiClient.post('FaqCategoriesApi/Create', data);
    return response.data;
  },

  update: async (id: number, data: FaqCategoryFormData): Promise<FaqCategory> => {
    const response = await apiClient.put(`FaqCategoriesApi/Update/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await apiClient.delete(`FaqCategoriesApi/Delete/${id}`);
    return response.data;
  }
};