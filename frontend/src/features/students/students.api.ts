import { api } from "../../services/api"
import type { CreateStudentPayload, Student, UpdateStudentPayload } from "./students.types"

export type { Student, CreateStudentPayload, UpdateStudentPayload } from "./students.types"

const BASE = "/api/users/students"

export async function getStudents(): Promise<Student[]> {
  const res = await api.get(BASE)
  // Backend returns { data: { students: [...] } }
  const data = res.data.data?.students || res.data.students || res.data.data || res.data
  return Array.isArray(data) ? data : []
}

export async function getStudent(id: string): Promise<Student> {
  const res = await api.get(`${BASE}/${id}`)
  // Backend returns { data: { student: {...} } }
  return res.data.data?.student || res.data.student || res.data.data || res.data
}

export async function createStudent(payload: CreateStudentPayload): Promise<Student> {
  const res = await api.post(BASE, payload)
  // Backend returns { data: { student: {...}, auth: {...} } }
  return res.data.data?.student || res.data.student || res.data.data || res.data
}

export async function updateStudent(id: string, payload: UpdateStudentPayload): Promise<Student> {
  const res = await api.patch(`${BASE}/${id}`, payload)
  // Backend returns { data: { student: {...} } }
  return res.data.data?.student || res.data.student || res.data.data || res.data
}

export async function removeStudent(id: string): Promise<void> {
  await api.delete(`${BASE}/${id}`)
}
