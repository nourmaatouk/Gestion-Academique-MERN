export type Teacher = {
  _id: string
  userId: string
  teacherId: string
  specialite: string
  department?: string
  email?: string
  firstName?: string
  lastName?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateTeacherPayload = {
  email: string
  password: string
  firstName: string
  lastName: string
  teacherId: string
  specialite: string
  department?: string
}

export type UpdateTeacherPayload = Partial<Omit<CreateTeacherPayload, "password">>
