export interface EmployeeCard {
  id: string;
  fullNameEn: string;
  jobTitle: string | null;
  department: string | null;
  email: string;
  mobileNumber: string | null;
  photoUrl: string | null;
  orderIndex: number;
  status: boolean;
  deletable: boolean;
}

export interface CardControlResponseData {
  items: EmployeeCard[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CardControlResponse {
  success: boolean;
  data: CardControlResponseData;
  message: string | null;
  errors: string[];
}

export interface CardControlFilters {
  pageNumber: number;
  pageSize: number;
  search?: string;
  filterBy?: string;
  department?: string;
}

export interface CardControlTableItem {
  id: string;
  fullNameEn: string;
  jobTitle: string;
  department: string;
  email: string;
  mobileNumber: string | null;
  photoUrl: string | null;
  status: boolean;
  deletable: boolean;
}
