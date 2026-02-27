export interface CatalogItem {
  id: number;
  name: string;
  nameLa: string;
  url?: string;
  icon?: string;
  darkModeIcon?: string;
  parentId?: number | null;
  widgetType: number;
  children?: CatalogItem[];
  hasChildren?: boolean; // To track if item can have children
  level?: number; // To track nesting level
}

export interface CatalogFormData {
  id?: number;
  name: string;
  nameLa: string;
  url: string;
  icon?: string;
  darkModeIcon?: string;
  parentId?: number | null;
  widgetType: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string | null;
  errors: string[];
}
