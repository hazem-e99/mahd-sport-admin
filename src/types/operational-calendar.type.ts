export interface EventItem {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  categoryId: number;
  categoryName: string;
  color: string;
  categoryStyle: 0 | 1;
  icon: string;
  visibleTo: 0 | 1;
  details: string;
  allowedRoles?: {
    id: number;
    name: string;
    nameLa: string;
  }[];
}

export interface EventCategory {
  id: number;
  name: string;
  nameLa: string;
  color: string;
  icon: string;
  categoryStyle: 0 | 1;
}

export interface EventApiParams {
  "Pagination.PageNumber": number;
  "Pagination.PageSize": number;
  "FilterDto.CategoryId"?: number;
  "FilterDto.VisibleTo"?: number;
  "FilterDto.Title"?: string;
  "SortByColumn.sortDirection"?: "asc" | "desc";
  "FilterDto.StartDateFrom"?: string;
  "FilterDto.EndDateTo"?: string;
  "SortByColumn.sortBy"?: string;
}

export interface EventCategoryApiParams {
  "Pagination.PageNumber": number;
  "Pagination.PageSize": number;
  "SortByColumn.sortDirection"?: "asc" | "desc";
  searchTerm?: string;
}

export interface EventFormInputs {
  title: string;
  startDate: string;
  endDate: string;
  categoryId: number;
  visibleTo: number;
  roleIds?: number[];
  details: string;
}

export interface EventCategoryFormInputs {
  name: string;
  nameLa: string;
  color: string;
  icon: string;
  categoryStyle: 0 | 1;
}
