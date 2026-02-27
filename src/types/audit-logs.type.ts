// Audit Logs Types

import type { AuditLog } from "@/api/services/AuditService";

export interface AuditLogFilters {
    searchTerm?: string;
    fromDate?: string;
    toDate?: string;
    actionType?: string;
    adminUserId?: number;
}

export interface AuditLogResponse {
    items: AuditLog[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ActionTypeOption {
    value: string;
    label: string;
}



// API request/response types
export interface GetAuditLogsRequest {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    fromDate?: string;
    toDate?: string;
    actionType?: string;
    adminUserId?: number;
}

export interface CreateAuditLogRequest {
    actionType: string;
    details: string;
    targetId?: string;
    metadata?: Record<string, any>;
}

// Re-export API types from service
export type { AuditEntityResponse, AuditLog, AuditLogsResponse } from "@/api/services/AuditService";

