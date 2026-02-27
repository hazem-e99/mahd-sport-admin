import axiosClient from '@/axiosClient';
import { EMPLOYEES_API } from './employees';

export const updateEmployeesFromAzureAD = async () => {
    const { data } = await axiosClient.get(EMPLOYEES_API.updateEmployeesFromAzureAD);
    return data;
};