export type Course = {
  _id: string
  courseId: string
  name: string
  description?: string
  credits: number
  hours: number
  department: string
  createdAt?: string
  updatedAt?: string
}

export type CreateCoursePayload = {
  courseId: string
  name: string
  description?: string
  credits: number
  hours: number
  department: string
}

export type UpdateCoursePayload = Partial<CreateCoursePayload>
