import { EMPLOYEES_API } from "../endpoints/employees";
import axiosClient from "@/axiosClient";
import type { CardControlFilters, CardControlResponse } from "../../types/card-control.type";

export class CardControlService {
  static async getEmployees(filters: CardControlFilters): Promise<CardControlResponse> {
    const params = new URLSearchParams();
    params.append('Pagination.PageNumber', filters.pageNumber.toString());
    params.append('Pagination.PageSize', filters.pageSize.toString());

    if (filters.search) {
      params.append('FilterDto.Search', filters.search);
    }

    if (filters.filterBy) {
      params.append('FilterDto.Status', filters.filterBy === 'show' ? 'true' : 'false');
    }

    if (filters.department) {
      params.append('FilterDto.Department', filters.department);
    }

    const response = await axiosClient.get(`${EMPLOYEES_API.getEmployees}?${params.toString()}`);
    return response.data;
  }

  static async getDepartments(): Promise<string[]> {
    try {
      const response = await axiosClient.get(EMPLOYEES_API.getDepartments);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch departments');
    }
  }

  static async updateEmployeeStatus(email: string, status: boolean): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await axiosClient.put(EMPLOYEES_API.updateEmployeeStatus, {
        email,
        status
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update employee status');
    }
  }

  static async updateEmployee(updateData: {
    email: string;
    status: boolean;
    orderIndex: number;
    photoPath: string | null;
  }): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await axiosClient.put(EMPLOYEES_API.updateEmployee, updateData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update employee');
    }
  }
}
