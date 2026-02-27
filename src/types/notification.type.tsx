export interface Notification {
  id: number;
  title: string;
  audience: string;
  status: string;
  scheduledAt: string;
  sender: string;
  allowedRoles: string[];
}

export interface NotificationTableData {
  id: number;
  title: string;
  audience: string;
  status: string;
  scheduledAt: string;
  sender: string;
  allowedRoles: string[];
}

export interface NotificationFilterState {
  searchTerm: string;
  audienceFilter: string;
  statusFilter: string;
}

export interface NotificationPaginationState {
  currentPage: number;
  itemsPerPage: number;
} 