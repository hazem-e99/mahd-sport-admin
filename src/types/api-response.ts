export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  errors: string[];
}

export interface PaginatedData<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type PaginatedApiResponse<T> = ApiResponse<PaginatedData<T>>;
