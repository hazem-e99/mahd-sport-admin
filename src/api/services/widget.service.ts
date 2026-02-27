import apiClient from "../../axiosClient";
import { WIDGET_API } from "../endpoints/widget";

export interface WidgetListParams {
  pageNumber?: number;
  pageSize?: number;
  name?: string;
  widgetType?: number;
  status?: number;
  categoryId?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
}

export interface CategoryDictionaryItem {
  id: string;
  name: string;
  nameLa: string;
  deletable: boolean;
}

export interface WidgetTypeItem {
  key: string | number;
  value: string;
}

export interface WidgetData {
  id?: number | string;
  name: string;
  nameLa?: string;
  status?: number;
  widgetType?: number;
  tabWidgetCategoryId?: number;
  url?: string;
  parentId?: number;
  [key: string]: unknown;
}

export interface CategoryFormData {
  name: string;
  nameLa: string;
}

export interface UserWidgetSubData {
  id?: number | string;
  name: string;
  nameLa: string;
  url: string;
  parentId?: any;
  widgetType: number;
  icon?: any;
  darkModeIcon?: string;
}

export interface ServiceCatalogParent {
  id: number;
  name: string;
  nameLa: string;
}

export const WidgetService = {
  getAll: async (params: WidgetListParams = {}) => {
    const queryParams = new URLSearchParams();
    queryParams.append("Pagination.PageNumber", String(params.pageNumber ?? 1));
    queryParams.append("Pagination.PageSize", String(params.pageSize ?? 10));
    if (params.name) queryParams.append("TabFilterDto.Name", params.name);
    if (params.widgetType !== undefined)
      queryParams.append("TabFilterDto.WidgetType", String(params.widgetType));
    if (params.status !== undefined)
      queryParams.append("TabFilterDto.Status", String(params.status));
    if (params.categoryId !== undefined)
      queryParams.append("TabFilterDto.CategoryId", String(params.categoryId));
    if (params.sortBy) queryParams.append("SortByColumn.sortBy", params.sortBy);
    if (params.sortDirection)
      queryParams.append("SortByColumn.sortDirection", params.sortDirection);

    const { data } = await apiClient.get(
      WIDGET_API.getAll + "?" + queryParams.toString()
    );
    return data;
  },

  getById: async (id: number | string) => {
    const response = await apiClient.get(`${WIDGET_API.getById}?Id=${id}`);
    return response.data;
  },

  create: async (data: WidgetData) => {
    const response = await apiClient.post(WIDGET_API.create, data);
    return response.data;
  },

  update: async (data: WidgetData) => {
    const response = await apiClient.post(WIDGET_API.update, data);
    return response.data;
  },

  getCategories: async (): Promise<CategoryItem[]> => {
    const response = await apiClient.get<CategoryItem[]>(
      WIDGET_API.getCategories
    );
    return response.data;
  },
  getCategoriesWidget: async (): Promise<CategoryItem[]> => {
    const response = await apiClient.get<CategoryItem[]>(
      WIDGET_API.getCategoriesWidget
    );
    return response.data;
  },

  getWidgetTypes: async (): Promise<WidgetTypeItem[]> => {
    const response = await apiClient.get<WidgetTypeItem[]>(
      WIDGET_API.getWidgetTypes
    );
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await apiClient.post(WIDGET_API.delete, { id });
    return response.data;
  },

  createUserWidgetSub: async (data: UserWidgetSubData) => {
    const response = await apiClient.post(WIDGET_API.createUserWidgetSub, data);
    return response.data;
  },

  updateUserWidgetSub: async (data: UserWidgetSubData) => {
    const response = await apiClient.put(WIDGET_API.updateUserWidgetSub, data);
    return response.data;
  },

  getUserWidgetSub: async (params: {
    ParentType: number;
    ParentId?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.ParentType)
      queryParams.append("ParentType", params.ParentType.toString());
    if (params.ParentId)
      queryParams.append("ParentId", params.ParentId.toString());

    const response = await apiClient.get(
      WIDGET_API.getUserWidgetSub + "?" + queryParams.toString()
    );
    return response.data.data;
  },

  deleteUserWidgetSub: async (id: string | number) => {
    const response = await apiClient.post(WIDGET_API.delete, { id });
    return response.data;
  },

  getAllServiceCatalogParents: async (): Promise<ServiceCatalogParent[]> => {
    const response = await apiClient.get<{
      success: boolean;
      data: ServiceCatalogParent[];
      message: string | null;
      errors: string[];
    }>(WIDGET_API.getAllServiceCatalogParents);
    return response.data.data;
  },
};

export const WidgetCategoryService = {
  create: async (data: CategoryFormData) => {
    const response = await apiClient.post(WIDGET_API.CATEGORY.CREATE, data);
    return response.data;
  },

  update: async (id: number, data: CategoryFormData) => {
    const response = await apiClient.put(WIDGET_API.CATEGORY.update, {
      ...data,
      id,
    });
    return response.data;
  },

  delete: async (id: number) => {
    try {
      const response = await apiClient.post<any>(WIDGET_API.CATEGORY.delete, {
        id,
      });
      return response.data;
    } catch (error) {
      // throw handleApiError(error);
      console.log(error);
    }
  },
  getDictionary: async (): Promise<CategoryDictionaryItem[]> => {
    const response = await apiClient.get(WIDGET_API.CATEGORY.GET_DICTIONARY);
    return response.data;
  },
};

export const AppRolesService = {
  getDictionary: async (): Promise<any[]> => {
    const response = await apiClient.get(WIDGET_API.ROLES.GET_DICTIONARY);
    return response.data;
  },

  getTabVisibilityList: async (): Promise<{
    success: boolean;
    data: any[];
    message: string | null;
    errors: string[];
  }> => {
    const response = await apiClient.get(WIDGET_API.ROLES.GET_VISIBILITY_LIST);
    return response.data;
  },
};
