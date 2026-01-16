import { api } from "../../services/api"
import type { CourseAssignment, CreateAssignmentPayload, UpdateAssignmentPayload } from "./assignments.types"

const BASE = "/api/courses/assignments"

export async function getAllAssignments(): Promise<CourseAssignment[]> {
  const res = await api.get(BASE)
  // Backend returns { data: { assignments: [...] } }
  const data = res.data.data?.assignments || res.data.assignments || res.data.data || res.data
  return Array.isArray(data) ? data : []
}

export async function createAssignment(payload: CreateAssignmentPayload): Promise<CourseAssignment> {
  const res = await api.post(BASE, payload)
  return res.data.data?.assignment || res.data.assignment || res.data.data || res.data
}

export async function getAssignmentsByTeacher(teacherId: string): Promise<CourseAssignment[]> {
  const res = await api.get(`${BASE}/teacher/${teacherId}`)
  const data = res.data.data?.assignments || res.data.assignments || res.data.data || res.data
  return Array.isArray(data) ? data : []
}

export async function updateAssignment(id: string, payload: UpdateAssignmentPayload): Promise<CourseAssignment> {
  const res = await api.patch(`${BASE}/${id}`, payload)
  return res.data.data?.assignment || res.data.assignment || res.data.data || res.data
}

export async function deleteAssignment(id: string): Promise<void> {
  await api.delete(`${BASE}/${id}`)
}
