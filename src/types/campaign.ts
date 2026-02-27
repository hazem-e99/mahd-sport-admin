export interface Campaign {
  id: number;
  endDate: string;
  name: string;
  startDate: string;
  statusName: string;
  status: number;
  typeId: number;
  typeName: string;
  visiblityId: number;
  visiblityName: string;
}

export interface CreateCampaignRequest {
  name: string;
  image?: string;
  link?: string;
  description?: string;
  startDate: string;
  startTime: {
    ticks: number;
    days: number;
    hours: number;
    milliseconds: number;
    microseconds: number;
    minutes: number;
    seconds: number;
  };
  endDate: string;
  endTime: {
    ticks: number;
    days: number;
    hours: number;
    milliseconds: number;
    microseconds: number;
    minutes: number;
    seconds: number;
  };
  visibleTo: number;
  allowedRoleIds: number[];
  campaignTypeId: number;
}

// Types
export interface CampaignTableData {
  id: string | number;
  campaignTitle: string;
  type: string;
  startDate: string;
  endDate: string;
  visiblity: string;
  visiblityId: number;
  status: string;
  statusId: number;
  statusName: string;
}

export interface FilterState {
  searchTerm: string;
  visibilityFilter: string;
  statusFilter: string;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}
