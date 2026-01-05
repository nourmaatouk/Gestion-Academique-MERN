import { api } from "../../services/api";
import type { StudentGradesResponse, CourseGradesResponse, UpdateGradeData } from "./grades.types";

const BASE = "/api/grades";

export const gradesApi = {
  getStudentGrades: async (studentId: string): Promise<StudentGradesResponse> => {
    const res = await api.get(`${BASE}/student/${studentId}`);
    return res.data.data || res.data;
  },

  getCourseGrades: async (courseId: string): Promise<CourseGradesResponse> => {
    const res = await api.get(`${BASE}/course/${courseId}`);
    return res.data.data || res.data;
  },

  updateGrade: async (data: UpdateGradeData): Promise<void> => {
    await api.patch(`${BASE}/update`, data);
  },
};
