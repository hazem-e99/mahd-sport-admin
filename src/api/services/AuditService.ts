import axiosClient from "@/axiosClient";

export interface AuditEntityResponse {
    success: boolean;
    data: Array<{
        key: string;
        value: string;
    }>;
}

export interface AuditLog {
    id: number;
    timestamp: string;
    username: string;
    action: string;
    entityName: string;
    details: string;
    userId?: number;
    targetId?: string;
    ipAddress?: string;
    userAgent?: string;
    roleName?: string;
}

export interface AuditLogsResponse {
    success: boolean;
    data: {
        items: AuditLog[];
        totalCount: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export interface GetAuditLogsParams {
    pageNumber?: number;
    pageSize?: number;
    Entity?: string;
    Action?: number;
    FromDate?: string;
    ToDate?: string;
    userId?: string;
    RoleName?: string;
}

export const AuditService = {
    // Get audit entities (action types)
    getEntities: async (): Promise<AuditEntityResponse> => {
        try {
            const response = await axiosClient.get('/AuditApi/GetEntities');
            return response.data;
        } catch (error) {
            console.error('Error fetching audit entities:', error);
            throw error;
        }
    },

    // Get audit logs with filters
    getAuditLogs: async (params: GetAuditLogsParams = {}): Promise<AuditLogsResponse> => {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.pageNumber) queryParams.append('Pagination.PageNumber', params.pageNumber.toString());
            if (params.pageSize) queryParams.append('Pagination.PageSize', params.pageSize.toString());
            if (params.Entity && params.Entity !== "0") queryParams.append('Entity', params.Entity);
            if (params.Action && params.Action !== 0) queryParams.append('Action', params.Action.toString());
            if (params.FromDate) queryParams.append('FromDate', params.FromDate);
            if (params.ToDate) queryParams.append('ToDate', params.ToDate);
            if (params.userId) queryParams.append('UserId', params.userId);
            if (params.RoleName) queryParams.append('RoleName', params.RoleName);
 
            const url = `/AuditApi/GetAudits${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            
            const response = await axiosClient.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            throw error;
        }
    },

    // Export audit logs - returns raw response (array أو ملفوفة داخل data)
    exportAudits: async (params: GetAuditLogsParams = {}): Promise<any> => {
        const queryParams = new URLSearchParams();

        if (params.FromDate) queryParams.append("FromDate", params.FromDate);
        if (params.ToDate) queryParams.append("ToDate", params.ToDate);
        if (params.Entity && params.Entity !== "0") queryParams.append("Entity", params.Entity);
        if (params.Action && params.Action !== 0) queryParams.append("Action", params.Action.toString());
        if (params.userId) queryParams.append("UserId", params.userId);
        if (params.RoleName) queryParams.append("RoleName", params.RoleName);

        const url = `/AuditApi/ExportAudits${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

        const response = await axiosClient.get(url);
        return response.data;
    }
};
