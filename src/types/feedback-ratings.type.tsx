export interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export interface FeedbackRatingsResponse {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: RatingDistribution[];
}

export interface FeedbackRatingsRequest {
  fromDate?: string;
  toDate?: string;
}

export interface FeedbackItem {
  id: number;
  userName: string | null;
  rating: number;
  feedbackText: string;
  department: string | null;
  createdOn: string;
}

export interface PaginatedFeedbackData {
  items: FeedbackItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface FeedbackListResponse {
  success: boolean;
  data: PaginatedFeedbackData;
  message: string | null;
  errors: string[];
}

export interface FeedbackListRequest {
  pageNumber?: number;
  pageSize?: number;
  fromDate?: string;
  toDate?: string;
  department?: string;
}

export interface FeedbackDetailsResponse {
  success: boolean;
  data: FeedbackItem;
  message: string | null;
  errors: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  errors: string[];
}