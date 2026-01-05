import { api } from "../../services/api"
import type { CreateTeacherPayload, Teacher, UpdateTeacherPayload } from "./teachers.types"

const BASE = "/api/users/teachers"

export async function getTeachers(): Promise<Teacher[]> {
  const res = await api.get(BASE)
  // Backend returns { data: { teachers: [...] } }
  const data = res.data.data?.teachers || res.data.teachers || res.data.data || res.data
  return Array.isArray(data) ? data : []
}

export async function getTeacher(id: string): Promise<Teacher> {
  const res = await api.get(`${BASE}/${id}`)
  // Backend returns { data: { teacher: {...} } }
  return res.data.data?.teacher || res.data.teacher || res.data.data || res.data
}

export async function createTeacher(payload: CreateTeacherPayload): Promise<Teacher> {
  const res = await api.post(BASE, payload)
  // Backend returns { data: { teacher: {...}, auth: {...} } }
  return res.data.data?.teacher || res.data.teacher || res.data.data || res.data
}

export async function updateTeacher(id: string, payload: UpdateTeacherPayload): Promise<Teacher> {
  const res = await api.patch(`${BASE}/${id}`, payload)
  // Backend returns { data: { teacher: {...} } }
  return res.data.data?.teacher || res.data.teacher || res.data.data || res.data
}

export async function removeTeacher(id: string): Promise<void> {
  await api.delete(`${BASE}/${id}`)
}
