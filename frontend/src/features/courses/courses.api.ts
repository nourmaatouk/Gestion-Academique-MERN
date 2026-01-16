import { api } from "../../services/api"
import type { Course, CreateCoursePayload, UpdateCoursePayload } from "./courses.types"

const BASE = "/api/courses/courses"

export async function getCourses(): Promise<Course[]> {
  const res = await api.get(BASE)
  // Backend returns { data: { courses: [...] } }
  const data = res.data.data?.courses || res.data.courses || res.data.data || res.data
  return Array.isArray(data) ? data : []
}

export async function getCourse(id: string): Promise<Course> {
  const res = await api.get(`${BASE}/${id}`)
  // Backend returns { data: { course: {...} } }
  return res.data.data?.course || res.data.course || res.data.data || res.data
}

export async function createCourse(payload: CreateCoursePayload): Promise<Course> {
  const res = await api.post(BASE, payload)
  // Backend returns { data: { course: {...} } }
  return res.data.data?.course || res.data.course || res.data.data || res.data
}

export async function updateCourse(id: string, payload: UpdateCoursePayload): Promise<Course> {
  const res = await api.patch(`${BASE}/${id}`, payload)
  // Backend returns { data: { course: {...} } }
  return res.data.data?.course || res.data.course || res.data.data || res.data
}

export async function removeCourse(id: string): Promise<void> {
  await api.delete(`${BASE}/${id}`)
}
