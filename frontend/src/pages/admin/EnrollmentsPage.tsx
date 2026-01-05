import { useEffect, useState } from "react"
import AdminLayout from "../../components/layout/AdminLayout"
import { createEnrollment, getEnrollmentsByCourse, updateEnrollment, deleteEnrollment } from "../../features/enrollments/enrollments.api"
import type { CreateEnrollmentPayload, Enrollment, UpdateEnrollmentPayload } from "../../features/enrollments/enrollments.types"
import { getCourses } from "../../features/courses/courses.api"
import { getStudents } from "../../features/students/students.api"
import type { Course } from "../../features/courses/courses.types"
import type { Student } from "../../features/students/students.types"

export default function EnrollmentsPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // selected course for viewing enrollments
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [loadingEnrollments, setLoadingEnrollments] = useState(false)

  // create form
  const [form, setForm] = useState<CreateEnrollmentPayload>({
    studentId: "",
    courseId: "",
    semester: "2025-2026-S1",
  })
  const [creating, setCreating] = useState(false)

  // edit enrollment
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<UpdateEnrollmentPayload>({})
  const [savingEdit, setSavingEdit] = useState(false)

  const loadInitialData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [coursesData, studentsData] = await Promise.all([getCourses(), getStudents()])
      setCourses(coursesData)
      setStudents(studentsData)
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const loadEnrollments = async (courseId: string) => {
    if (!courseId) {
      setEnrollments([])
      return
    }
    setLoadingEnrollments(true)
    setError(null)
    try {
      const data = await getEnrollmentsByCourse(courseId)
      setEnrollments(data)
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to load enrollments")
    } finally {
      setLoadingEnrollments(false)
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    loadEnrollments(selectedCourseId)
  }, [selectedCourseId])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.studentId || !form.courseId || !form.semester) {
      setError("Select a student, course, and semester")
      return
    }

    setCreating(true)
    try {
      const created = await createEnrollment(form)
      if (selectedCourseId === form.courseId) {
        setEnrollments((prev) => [created, ...prev])
      }
      setForm({ studentId: "", courseId: "", semester: "2025-2026-S1" })
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Create enrollment failed")
    } finally {
      setCreating(false)
    }
  }

  const startEdit = (en: Enrollment) => {
    setEditingId(en.enrollmentId)
    setEditForm({
      grade: en.grade ?? undefined,
      status: en.status,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const saveEdit = async () => {
    if (!editingId) return
    setError(null)
    setSavingEdit(true)
    try {
      const updated = await updateEnrollment(editingId, editForm)
      setEnrollments((prev) => prev.map((x) => (x.enrollmentId === editingId ? updated : x)))
      cancelEdit()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Update failed")
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDelete = async (enrollmentId: string) => {
    if (!confirm("Are you sure you want to delete this enrollment?")) return
    setError(null)
    try {
      await deleteEnrollment(enrollmentId)
      setEnrollments((prev) => prev.filter((x) => x.enrollmentId !== enrollmentId))
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Delete failed")
    }
  }

  const getStudentName = (studentId: string) => {
    const s = students.find((st) => st.studentId === studentId)
    return s ? `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || s.studentId : studentId
  }

  const getStudentEmail = (studentId: string) => {
    const s = students.find((st) => st.studentId === studentId)
    return s?.email || "—"
  }

  const getCourseName = (courseId: string) => {
    const c = courses.find((co) => co.courseId === courseId)
    return c ? c.name : courseId
  }

  return (
    <AdminLayout title="Enrollments">
      {/* error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading courses and students...</div>
      ) : (
        <>
          {/* create form */}
          <form onSubmit={onCreate} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-sm font-semibold text-gray-900">Enroll student in a course</div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Student *">
                <select
                  className="input"
                  value={form.studentId}
                  onChange={(e) => setForm((p) => ({ ...p, studentId: e.target.value }))}
                >
                  <option value="">Select student...</option>
                  {students.map((s) => (
                    <option key={s._id} value={s.studentId}>
                      {s.firstName} {s.lastName} ({s.studentId})
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
                  className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {creating ? "Enrolling..." : "Enroll"}
                </button>
              </div>
            </div>
          </form>

          {/* view enrollments by course */}
          <div className="mt-6">
            <div className="mb-3 text-sm font-semibold text-gray-900">View enrollments by course</div>

            <select
              className="input max-w-md"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              <option value="">Select a course to view enrollments...</option>
              {courses.map((c) => (
                <option key={c._id} value={c.courseId}>
                  {c.name} ({c.courseId})
                </option>
              ))}
            </select>
          </div>

          {/* enrollments table */}
          {selectedCourseId && (
            <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-3 py-2 font-medium">Student</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Course</th>
                    <th className="px-3 py-2 font-medium">Semester</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Grade</th>
                    <th className="px-3 py-2 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {loadingEnrollments ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-6 text-gray-500">
                        Loading enrollments...
                      </td>
                    </tr>
                  ) : enrollments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-6 text-gray-500">
                        No enrollments found for this course.
                      </td>
                    </tr>
                  ) : (
                    enrollments.map((en) => (
                      <tr key={en._id} className="text-gray-900">
                        <td className="px-3 py-2">{getStudentName(en.studentId)}</td>
                        <td className="px-3 py-2 text-gray-500 text-xs">{getStudentEmail(en.studentId)}</td>
                        <td className="px-3 py-2">
                          <div>{getCourseName(en.courseId)}</div>
                          <div className="text-xs text-blue-600 font-mono">{en.courseId}</div>
                        </td>
                        <td className="px-3 py-2">
                          <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">{en.semester}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`rounded px-2 py-0.5 text-xs ${
                              en.status === "completed"
                                ? "bg-green-50 text-green-600"
                                : en.status === "dropped"
                                ? "bg-red-50 text-red-600"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {en.status}
                          </span>
                        </td>
                        <td className="px-3 py-2">{en.grade ?? "—"}</td>
                        <td className="px-3 py-2">
                          {editingId === en.enrollmentId ? (
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={saveEdit}
                                disabled={savingEdit}
                                className="rounded-md bg-green-50 px-2 py-1 text-xs text-green-600 hover:bg-green-100 disabled:opacity-60"
                              >
                                {savingEdit ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => startEdit(en)}
                                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(en.enrollmentId)}
                                className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* edit panel */}
          {editingId && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 text-sm font-semibold text-gray-900">Edit enrollment</div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Grade (0-20)">
                  <input
                    className="input"
                    type="number"
                    min={0}
                    max={20}
                    value={editForm.grade ?? ""}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, grade: e.target.value ? Number(e.target.value) : undefined }))
                    }
                  />
                </Field>
                <Field label="Status">
                  <select
                    className="input"
                    value={editForm.status ?? ""}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, status: e.target.value as any }))
                    }
                  >
                    <option value="enrolled">Enrolled</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped</option>
                  </select>
                </Field>
              </div>
            </div>
          )}
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
