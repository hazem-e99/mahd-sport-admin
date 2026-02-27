export interface WidgetItem {
  id: number;
  name: string;
  nameLa: string;
  status: number;
  statusName: string;
  widgetType: number;
  widgetTypeName: string;
  tabWidgetCategoryId: number;
  categoryName: string;
  categoryNameLa: string;
  deletable?: boolean;
}

export interface WidgetListResponse {
  success: boolean;
  data: {
    items: WidgetItem[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  message: string | null;
  errors: string[];
} 