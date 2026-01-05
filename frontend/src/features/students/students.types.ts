export type Student = {
  _id: string
  userId: string
  studentId: string
  dateNaissance: string
  filiere: string
  department?: string
  email?: string
  firstName?: string
  lastName?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateStudentPayload = {
  email: string
  password: string
  firstName: string
  lastName: string
  studentId: string
  dateNaissance: string // "YYYY-MM-DD"
  filiere: string
  department?: string
}

export type UpdateStudentPayload = Partial<Omit<CreateStudentPayload, "password">>
