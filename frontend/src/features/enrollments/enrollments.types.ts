export type Enrollment = {
  _id: string
  enrollmentId: string
  studentId: string
  courseId: string
  grade?: number | null
  semester: string
  status: "enrolled" | "completed" | "dropped"
  enrollmentDate?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateEnrollmentPayload = {
  studentId: string
  courseId: string
  semester: string
}

export type UpdateEnrollmentPayload = {
  grade?: number
  status?: "enrolled" | "completed" | "dropped"
}
