import { api } from "../../services/api";
import type { Department, CreateDepartmentData } from "./departments.types";

const BASE = "/api/courses/departments";

export const departmentsApi = {
  getAll: async (): Promise<Department[]> => {
    const res = await api.get(BASE);
    // Backend returns { data: { departments: [...] } }
    const data = res.data.data?.departments || res.data.departments || res.data.data || res.data;
    return Array.isArray(data) ? data : [];
  },

  create: async (data: CreateDepartmentData): Promise<Department> => {
    const res = await api.post(BASE, data);
    return res.data.data?.department || res.data.department || res.data.data || res.data;
  },

  update: async (id: string, data: Partial<CreateDepartmentData>): Promise<Department> => {
    const res = await api.patch(`${BASE}/${id}`, data);
    return res.data.data?.department || res.data.department || res.data.data || res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE}/${id}`);
  },
};
