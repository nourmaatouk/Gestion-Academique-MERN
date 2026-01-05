export interface Department {
  _id: string;
  deptId: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDepartmentData {
  deptId: string;
  name: string;
  description?: string;
}
