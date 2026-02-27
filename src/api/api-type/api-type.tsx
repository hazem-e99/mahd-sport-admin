export type PaginationResponse<T = unknown> = {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data: T;
  message: string | null;
  errors: unknown[];
};

export type PaginationParams = {
  PageNumber?: number;
  PageSize?: number;
};

export type SortParams = {
  sortBy?: string;
  sortDirection?: "asc" | "desc" | string;
};

export interface BaseFilterParams {
  Id?: string;
  Name?: string;
}

export type GetAllParams<TFilter = BaseFilterParams> = {
  Pagination?: PaginationParams;
  FilterDto?: TFilter;
  SortByColumn?: SortParams;
};

export interface DictionaryItem {
  key: string | number;
  value: string;
}
export interface VisibilityResponse {
  data: DictionaryItem[];
}
export interface CampaignType {
  id: string |number;
  name: string;
}


export interface CampaignTypes {
  id: number,
  name: string,
  nameLa: string
}

export interface WidgetCategoryResponse {
  categoryId: number;
  categoryName: string;
  widgets: DictionaryItem[];
}