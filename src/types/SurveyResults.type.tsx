export interface OverviewData {
  title: string;
  date: string;
  responses: string;
  metric: string;
}

export interface StatCardData {
  title: string;
  type:   'satisfaction' | 'activities';
  items: Array<{
    label: string;
    value: number;
    color: 'success' | 'info' | 'warning' | 'danger';
  }>;
}



export interface TabData {
  id: number;
  label: string;
  count?: number;
}



export interface TabsProps {
  tabs: TabData[];
  selectedTab: TabData;
  handleTabChange: (tab: TabData) => void;
}

export interface ResponsesListTabConfig {
  id:  number | string;
  user: string;
  department: string;
  submitted: string;
}


export interface GetAllResponsesParams {
  surveyId: number;
  pageNumber: number;
  pageSize: number;
  search?: string;
}

export interface SurveyResponseRow {
  id: number;
  user: string;
  department: string;
  submittedAt: string; 
}

export interface GetAllResponsesResult {
  items: SurveyResponseRow[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetSurveyResponseResult {
  id: number;
  user: string;
  department: string;
  submittedAt: string;
  answers: Array<{
    questionId: number;
    question: string;
    questionLa: string;
    type: number;
    answer: string;
  }>;
}
export interface ChoiceStat {
  text: string;
  count: number;
  percentage: number;
}

export interface AnalyticsQuestion {
  id: number;
  name: string;
  nameLa?: string;
  type: number;            
  choices: ChoiceStat[];   
  topComments: (string | { text: string })[];
  totalCommentsCount: number;
}

export interface AnalyticsResponse {
  items: AnalyticsQuestion[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
export interface CommentItem {
  text: string;
  submittedAt: string;
}

export interface CommentsResponse {
  items: CommentItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}



export interface SuggestionData {
  title: string;
  items: Array<{ text: string }>;
  commentCount: number;
}
