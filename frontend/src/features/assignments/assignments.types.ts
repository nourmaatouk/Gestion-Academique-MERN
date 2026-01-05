export type CourseAssignment = {
  _id: string
  assignmentId: string
  teacherId: string
  courseId: string
  semester: string
  assignedDate?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateAssignmentPayload = {
  assignmentId?: string
  teacherId: string
  courseId: string
  semester: string
}

export type UpdateAssignmentPayload = Partial<Omit<CreateAssignmentPayload, 'assignmentId'>>
