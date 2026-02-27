// src/api/services/HealthCheck.service.ts

import apiClient from "@/axiosClient";
import { HEALTH_CHECK } from "../endpoints/HealthCheck";

/* ===========================
 * Dashboard Types
 * =========================== */

export interface SystemStatus {
  uptimePercentage: number;
  status: "Good" | "Poor" | "Average"; // وسّعها لو عندك enum أوسع
  uptimeDuration: string;               // مثال: "30m 51s"
}




export interface HealthDashboardData {
  systemStatus: SystemStatus;
  activeUsers: number;
  uptimePercentage: number;
  
  avgResponseTime: number;
  pageViews: Record<string, number>; // مفاتيح ديناميكية (0..23)
  last100Requests: RequestLog[]; // <<< تم الإضافة
  top5MostUsedPages: MostUsedPage[];
}

export interface MostUsedPage {
  page: string;            // أو route / url
  pageViews: number;
  uniqueVisitors: number;
}

export interface HealthDashboardResponse {
  success: boolean;
  data: HealthDashboardData;
  errors: any[];
  message: string | null;
}

export interface RequestLog {
  requestUrl: string;
  responseTimeMs: number;
  timestamp: string; // ISO date string
}
/* ===========================
 * Logs Types (Paginated)
 * =========================== */

export type LogLevel = "error" | "warning" | "info" | "";

export interface ErrorLog {
  timestamp: string;          // e.g. "2025-06-16 13:45:12"
  userId: string;
  errorCode: string | number; // e.g. 500 | "SAP-CONN-FAIL"
  page: string;               // e.g. "/Api/Data"
  message: string;  
  userName:string;   
  level:string;       // e.g. "Internal Server Error"
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  message?: string | null;
  errors?: unknown[];
}

type GetLogsParams = {
  pageNumber?: number;
  pageSize?: number;
  query?: string;                                // free text
  level?: "error" | "warning" | "info" | "";     // optional filter
  userId?: string;                               // user ID filter
  errorCode?: string;                            // error code filter
  page?: string;                                 // page filter
  dateFrom?: string;                             // "YYYY-MM-DD" or ISO
  dateTo?: string;    
  userName?:string;                           // "YYYY-MM-DD" or ISO
  signal?: AbortSignal;
};

const toLogsApiParams = (p: GetLogsParams = {}) => ({
  "Pagination.PageNumber": p.pageNumber ?? 1,
  "Pagination.PageSize": p.pageSize ?? 10,
  ...(p.query ? { "FilterDto.SearchTerm": p.query } : {}),
  ...(p.level ? { "FilterDto.Level": p.level } : {}),
  ...(p.userName ? { "FilterDto.UserId": p.userName } : {}),
  ...(p.errorCode ? { "FilterDto.ErrorCode": p.errorCode } : {}),
  ...(p.page ? { "FilterDto.Page": p.page } : {}),
  ...(p.dateFrom ? { "FilterDto.DateFrom": p.dateFrom } : {}),
  ...(p.dateTo ? { "FilterDto.DateTo": p.dateTo } : {}),
});

/* ===========================
 * Monitor Integration Types
 * =========================== */

// شكل الرد حسب الصورة اللي بعتها: data: [ { systemName, status, lastSuccessfulSync, details } ]
export interface MonitorIntegrationItem {
  systemName: string;
  status: number;               // 0,1,2,...
  lastSuccessfulSync: string;   // ISO: "2025-09-23T10:03:28.9447476"
  details: string;
}

export interface MonitorIntegrationResponse {
  success: boolean;
  data: MonitorIntegrationItem[]; // Array
  message: string | null;
  errors: unknown[];
}

/* ===========================
 * UI Mapping (Cards)
 * =========================== */

export type CardStatus = "connected" | "degraded" | "error";

export interface IntegrationItem {
  id: string;
  name: string;
  description?: string;     // الباك لا يرسلها → تظل undefined
  lastSync: string | Date;
  status: CardStatus;
  details?: string;
  src?: string;             // الباك لا يرسلها → اختيارية
}

// ماب من enum الباك إلى Status الكروت
const STATUS_CARD_MAP: Record<number, CardStatus> = {
  0: "connected",
  1: "degraded",
  2: "error",
};

// (اختياري) ماب أيقونات حسب اسم النظام
const ICONS: Record<string, string> = {
  MicrosoftGraph: "/images/Microsoft.png",
  // زوّد حسب الأنظمة الموجودة عندك
};

// تحويل الـ API rows لشكل الكروت المستعمل في الـ UI
export const toIntegrationItems = (rows: MonitorIntegrationItem[]): IntegrationItem[] =>
  (Array.isArray(rows) ? rows : []).map((r) => ({
    id: r.systemName,                  // مفيش id → استخدم الاسم كمفتاح
    name: r.systemName,
    description: undefined,            // غير متاح من الباك
    lastSync: r.lastSuccessfulSync,
    status: STATUS_CARD_MAP[r.status] ?? "degraded",
    details: r.details,
    src: ICONS[r.systemName],          // قد تكون undefined → الكومبوننت هيعالجها
  }));

/* ===========================
 * Services
 * =========================== */

export const HealthCheckService = {
 
  async getDashboard(): Promise<HealthDashboardData> {
    const { data } = await apiClient.get<HealthDashboardResponse>(
      HEALTH_CHECK.getDashboard
    );
    return data.data;
  },
 
  async getMonitorIntegration(): Promise<MonitorIntegrationItem[]> {
    const { data } = await apiClient.get<MonitorIntegrationResponse>(
      HEALTH_CHECK.getMonitorIntegration
    );
    if (!data?.success) throw new Error(data?.message || "Failed to load monitor integration");
    return Array.isArray(data.data) ? data.data : [];
  },
 
  async getMonitorIntegrationCards(): Promise<IntegrationItem[]> {
    const rows = await this.getMonitorIntegration();
    return toIntegrationItems(rows);
  },
};
 
export const HealthCheckServicelogs = {
  async getLogs(params?: GetLogsParams) {
    const { data } = await apiClient.get<PaginatedApiResponse<ErrorLog>>(
      HEALTH_CHECK.getLogs,
      { 
        params: toLogsApiParams(params),
        signal: params?.signal
      }
    );

    if (!data.success) throw new Error(data.message || "Failed to load logs");

    const p = data.data;
    return {
      data: p.items,
      totalCount: p.totalCount,
      currentPage: p.pageNumber,
      totalPages: p.totalPages,
      hasNextPage: p.hasNextPage,
      hasPreviousPage: p.hasPreviousPage,
    };
  },

  async exportLogs(params: GetLogsParams = {}): Promise<any> {
    const queryParams = new URLSearchParams();

    if (params.dateFrom) queryParams.append("DateFrom", params.dateFrom);
    if (params.dateTo) queryParams.append("DateTo", params.dateTo);
    if (params.level) queryParams.append("Level", params.level);
    if (params.userName) queryParams.append("UserId", params.userName);
    if (params.errorCode) queryParams.append("ErrorCode", params.errorCode);
    if (params.page) queryParams.append("Page", params.page);
    if (params.query) queryParams.append("SearchTerm", params.query);

    const url = `${HEALTH_CHECK.exportLogs}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const { data } = await apiClient.get(url);
    return data;
  },
};
