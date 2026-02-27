import apiClient from "@/axiosClient";
import type { AnalyticsResponse, CommentsResponse, GetAllResponsesParams, GetAllResponsesResult, GetSurveyResponseResult } from "@/types/SurveyResults.type";
import { UserSurveys_API } from "../endpoints/UserSurvey";


const buildParams = (o: Record<string, any>) =>
  Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .reduce((q, [k, v]) => { q.append(k, String(v)); return q; }, new URLSearchParams());

export const SurveyResultsService = {

 getOverview: async (surveyId: number) => {
     
    const url = `${UserSurveys_API.getSurveyOverview}/${surveyId}`;
    const { data } = await apiClient.post<{
      success: boolean;
      data: {
        id: number;
        name: string;
        nameLa?: string;
        description?: string;
        descriptionLa?: string;
        startDate?: string;
        endDate?: string;
        surveyMode: 0 | 1; // 0 Anonymous, 1 User-Identified
        responses: number;
        totalResponses: number;
      }
    }>(url);
    if (!data?.success) throw new Error('Failed to fetch overview');
    return data.data;
  },
  getAnalytics: async (params: {
    surveyId: number;
    pageNumber?: number;
    pageSize?: number;
    type?: number;          // FilterDto.Type
    department?: string;    // FilterDto.Department
    text?: string;          // FilterDto.Text
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }) => {
    const qp = buildParams({
      'SurveyId': params.surveyId,
      'Pagination.PageNumber': params.pageNumber ?? 1,
      'Pagination.PageSize': params.pageSize ?? 10,
      'FilterDto.Type': params.type,
      'FilterDto.Department': params.department,
      'FilterDto.Text': params.text,
      'SortByColumn.sortBy': params.sortBy,
      'SortByColumn.sortDirection': params.sortDirection,
    });

    const url = `${UserSurveys_API.getAnalytics}?${qp.toString()}`;
    const { data } = await apiClient.post<{ success: boolean; data: AnalyticsResponse }>(url);
    if (!data?.success) throw new Error('Failed to fetch analytics');
    return data.data;
  },

  getAllComments: async (surveyId: number, questionId: number, pageNumber = 1, pageSize = 10) => {
    const qp = buildParams({
      'SurveyId': surveyId,
      'QuestionId': questionId,
      'Pagination.PageNumber': pageNumber,
      'Pagination.PageSize': pageSize,
    });
    const url = `${UserSurveys_API.getAllComments}?${qp.toString()}`;
    const { data } = await apiClient.post<{ success: boolean; data: CommentsResponse }>(url);
    if (!data?.success) throw new Error('Failed to fetch comments');
    return data.data;
  },
  async getAllSurveyResponses(params: GetAllResponsesParams): Promise<GetAllResponsesResult> {
    const q = new URLSearchParams();
    q.append("SurveyId", String(params.surveyId));
    q.append("Pagination.PageNumber", String(params.pageNumber));
    q.append("Pagination.PageSize", String(params.pageSize));
    if (params.search && params.search.trim()) q.append("Search", params.search.trim());

    const { data } = await apiClient.post<any>(
      `${UserSurveys_API.getAllSurveyResponses}?${q.toString()}`
    );

    if (!data?.success) throw new Error(data?.message || "Failed to fetch responses");

    const d = data.data;
    return {
      items: d.items ?? [],
      pageNumber: d.pageNumber ?? 1,
      totalPages: d.totalPages ?? 1,
      totalCount: d.totalCount ?? 0,
      hasPreviousPage: !!d.hasPreviousPage,
      hasNextPage: !!d.hasNextPage,
    };
  },

  async getSurveyResponse(surveyId: number, responseId: number): Promise<GetSurveyResponseResult> {
    const q = new URLSearchParams();
    q.append("SurveyId", String(surveyId));
    q.append("ResponseId", String(responseId));

    const { data } = await apiClient.post<any>(
      `${UserSurveys_API.getSurveyResponse}?${q.toString()}`
    );

    if (!data?.success) throw new Error(data?.message || "Failed to fetch response");

    return data.data as GetSurveyResponseResult;
  },


 };
