import { api } from "../../services/api"
import type { CreateEnrollmentPayload, Enrollment, UpdateEnrollmentPayload } from "./enrollments.types"

const BASE = "/api/courses/enrollments"

export async function getAllEnrollments(): Promise<Enrollment[]> {
  const res = await api.get(BASE)
  // Backend returns { data: { enrollments: [...] } }
  const data = res.data.data?.enrollments || res.data.enrollments || res.data.data || res.data
  return Array.isArray(data) ? data : []
}

export async function createEnrollment(payload: CreateEnrollmentPayload): Promise<Enrollment> {
  const res = await api.post(BASE, payload)
  return res.data.data?.enrollment || res.data.enrollment || res.data.data || res.data
}

export async function getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
  const res = await api.get(`${BASE}/student/${studentId}`)
  const data = res.data.data?.enrollments || res.data.enrollments || res.data.data || res.data
  return Array.isArray(data) ? data : []
}

export async function getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]> {
  const res = await api.get(`${BASE}/course/${courseId}`)
  const data = res.data.data?.enrollments || res.data.enrollments || res.data.data || res.data
  return Array.isArray(data) ? data : []
}

export async function updateEnrollment(enrollmentId: string, payload: UpdateEnrollmentPayload): Promise<Enrollment> {
  const res = await api.patch(`${BASE}/${enrollmentId}`, payload)
  return res.data.data?.enrollment || res.data.enrollment || res.data.data || res.data
}

export async function deleteEnrollment(enrollmentId: string): Promise<void> {
  await api.delete(`${BASE}/${enrollmentId}`)
}
