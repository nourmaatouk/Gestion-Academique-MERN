export interface Grade {
  courseId: string;
  grade: number | null;
  semester: string;
  enrollmentDate: string;
}

export interface StudentGradesResponse {
  grades: Grade[];
  average: number | null;
  count: number;
}

export interface CourseEnrollment {
  _id: string;
  enrollmentId: string;
  studentId: string;
  courseId: string;
  semester: string;
  grade: number | null;
  enrollmentDate: string;
}

export interface CourseGradesResponse {
  enrollments: CourseEnrollment[];
  statistics: {
    total: number;
    graded: number;
    average: number | null;
    min: number | null;
    max: number | null;
  };
}

export interface UpdateGradeData {
  enrollmentId: string;
  grade: number | null;
}
