import { useEffect, useState } from "react"
import AdminLayout from "../../components/layout/AdminLayout"
import { createAssignment, getAssignmentsByTeacher, getAllAssignments, deleteAssignment } from "../../features/assignments/assignments.api"
import type { CourseAssignment, CreateAssignmentPayload } from "../../features/assignments/assignments.types"
import { getCourses } from "../../features/courses/courses.api"
import { getTeachers } from "../../features/teachers/teachers.api"
import type { Course } from "../../features/courses/courses.types"
import type { Teacher } from "../../features/teachers/teachers.types"

export default function AssignmentsPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [assignments, setAssignments] = useState<CourseAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // selected teacher for viewing assignments
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("")
  const [loadingAssignments, setLoadingAssignments] = useState(false)

  // create form
  const [form, setForm] = useState<CreateAssignmentPayload>({
    teacherId: "",
    courseId: "",
    semester: "2025-2026-S1",
  })
  const [creating, setCreating] = useState(false)

  const loadInitialData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [coursesData, teachersData] = await Promise.all([getCourses(), getTeachers()])
      setCourses(coursesData)
      setTeachers(teachersData)
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const loadAssignments = async (teacherId: string) => {
    if (!teacherId) {
      // Load all assignments when no teacher is selected
      setLoadingAssignments(true)
      setError(null)
      try {
        const data = await getAllAssignments()
        setAssignments(data)
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Failed to load assignments")
      } finally {
        setLoadingAssignments(false)
      }
      return
    }
    setLoadingAssignments(true)
    setError(null)
    try {
      const data = await getAssignmentsByTeacher(teacherId)
      setAssignments(data)
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to load assignments")
    } finally {
      setLoadingAssignments(false)
    }
  }

  useEffect(() => {
    loadInitialData()
    // Load all assignments on initial load
    loadAssignments("")
  }, [])

  useEffect(() => {
    if (selectedTeacherId) {
      loadAssignments(selectedTeacherId)
    }
  }, [selectedTeacherId])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.teacherId || !form.courseId || !form.semester) {
      setError("Fill all required fields")
      return
    }

    setCreating(true)
    try {
      const created = await createAssignment(form)
      setAssignments((prev) => [created, ...prev])
      setForm({ teacherId: "", courseId: "", semester: "2025-2026-S1" })
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Create assignment failed")
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return
    setError(null)
    try {
      await deleteAssignment(id)
      setAssignments((prev) => prev.filter((x) => x._id !== id))
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Delete failed")
    }
  }

  const getTeacherName = (teacherId: string) => {
    const t = teachers.find((te) => te.teacherId === teacherId)
    return t ? `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim() || t.teacherId : teacherId
  }

  const getTeacherEmail = (teacherId: string) => {
    const t = teachers.find((te) => te.teacherId === teacherId)
    return t?.email || "—"
  }

  const getCourseName = (courseId: string) => {
    const c = courses.find((co) => co.courseId === courseId)
    return c ? c.name : courseId
  }

  return (
    <AdminLayout title="Assignments">
      {/* error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading courses and teachers...</div>
      ) : (
        <>
          {/* create form */}
          <form onSubmit={onCreate} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-sm font-semibold text-gray-900">Assign teacher to a course</div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Teacher *">
                <select
                  className="input"
                  value={form.teacherId}
                  onChange={(e) => setForm((p) => ({ ...p, teacherId: e.target.value }))}
                >
                  <option value="">Select teacher...</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t.teacherId}>
                      {t.firstName} {t.lastName} ({t.teacherId})
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Course *">
                <select
                  className="input"
                  value={form.courseId}
                  onChange={(e) => setForm((p) => ({ ...p, courseId: e.target.value }))}
                >
                  <option value="">Select course...</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c.courseId}>
                      {c.name} ({c.courseId})
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Semester *">
                <input
                  className="input"
                  value={form.semester}
                  onChange={(e) => setForm((p) => ({ ...p, semester: e.target.value }))}
                  placeholder="e.g. 2025-2026-S1"
                />
              </Field>

              <div className="flex items-end">
                <button
                  disabled={creating}
                  className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
                >
                  {creating ? "Assigning..." : "Assign"}
                </button>
              </div>
            </div>
          </form>

          {/* view assignments by teacher */}
          <div className="mt-6">
            <div className="mb-3 text-sm font-semibold text-gray-900">Filter by teacher (optional)</div>

            <select
              className="input max-w-md"
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
            >
              <option value="">All teachers</option>
              {teachers.map((t) => (
                <option key={t._id} value={t.teacherId}>
                  {t.firstName} {t.lastName} ({t.teacherId})
                </option>
              ))}
            </select>
          </div>

          {/* assignments table */}
          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-3 py-2 font-medium">Assignment ID</th>
                  <th className="px-3 py-2 font-medium">Teacher</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Course</th>
                  <th className="px-3 py-2 font-medium">Semester</th>
                  <th className="px-3 py-2 font-medium">Assigned Date</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loadingAssignments ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-gray-500">
                      Loading assignments...
                    </td>
                  </tr>
                ) : assignments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-gray-500">
                      No assignments found.
                    </td>
                  </tr>
                ) : (
                  assignments.map((a) => (
                    <tr key={a._id} className="text-gray-900">
                      <td className="px-3 py-2">{a.assignmentId}</td>
                      <td className="px-3 py-2">{getTeacherName(a.teacherId)}</td>
                      <td className="px-3 py-2 text-gray-500 text-xs">{getTeacherEmail(a.teacherId)}</td>
                      <td className="px-3 py-2">
                        <div>{getCourseName(a.courseId)}</div>
                        <div className="text-xs text-blue-600 font-mono">{a.courseId}</div>
                      </td>
                      <td className="px-3 py-2">
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">{a.semester}</span>
                      </td>
                      <td className="px-3 py-2">
                        {a.assignedDate ? new Date(a.assignedDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          background: white;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #111827;
          outline: none;
        }
        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }
        select.input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
      `}</style>
    </AdminLayout>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs text-gray-600">{label}</div>
      {children}
    </label>
  )
}
