import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import TeacherLayout from "../../components/layout/TeacherLayout"
import { getAssignmentsByTeacher } from "../../features/assignments/assignments.api"
import { getCourses } from "../../features/courses/courses.api"
import { getEnrollmentsByCourse } from "../../features/enrollments/enrollments.api"
import { getStudents } from "../../features/students/students.api"
import { gradesApi } from "../../features/grades/grades.api"
import { api } from "../../services/api"
import type { CourseAssignment } from "../../features/assignments/assignments.types"
import type { Course } from "../../features/courses/courses.types"
import type { Enrollment } from "../../features/enrollments/enrollments.types"
import type { Student } from "../../features/students/students.types"

interface EnrollmentWithStudent extends Enrollment {
  student?: Student
}

export default function TeacherGradesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [assignments, setAssignments] = useState<CourseAssignment[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<EnrollmentWithStudent[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingEnrollments, setLoadingEnrollments] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedCourseId = searchParams.get("course") || ""

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editGrade, setEditGrade] = useState<number | "">("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Get teacher profile to get teacherId
        const profileRes = await api.get("/api/users/teachers/profile")
        const profile = profileRes.data.data || profileRes.data

        // Get assignments for this teacher using typed API
        const assignmentList = await getAssignmentsByTeacher(profile.teacherId)
        setAssignments(assignmentList)

        // Get all courses using typed API
        const coursesList = await getCourses()
        setCourses(coursesList)

        // Get all students using typed API
        const studentsList = await getStudents()
        setStudents(studentsList)
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  useEffect(() => {
    const loadEnrollments = async () => {
      if (!selectedCourseId) {
        setEnrollments([])
        return
      }

      setLoadingEnrollments(true)
      setError(null)
      try {
        // Get enrollments using typed API
        const enrollmentList = await getEnrollmentsByCourse(selectedCourseId)

        // Combine with student data
        const combined = enrollmentList.map((e) => ({
          ...e,
          student: students.find((s) => s.studentId === e.studentId),
        }))

        setEnrollments(combined)
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Failed to load enrollments")
      } finally {
        setLoadingEnrollments(false)
      }
    }

    loadEnrollments()
  }, [selectedCourseId, students])

  const startEdit = (e: EnrollmentWithStudent) => {
    setEditingId(e.enrollmentId)
    setEditGrade(e.grade ?? "")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditGrade("")
  }

  const saveGrade = async () => {
    if (!editingId) return
    
    setError(null)
    setSaving(true)
    try {
      // Use the typed grades API to update the grade
      await gradesApi.updateGrade({
        enrollmentId: editingId,
        grade: editGrade === "" ? null : Number(editGrade)
      })

      // Reload enrollments using typed API
      const enrollmentList = await getEnrollmentsByCourse(selectedCourseId)
      const combined = enrollmentList.map((e) => ({
        ...e,
        student: students.find((s) => s.studentId === e.studentId),
      }))
      setEnrollments(combined)

      cancelEdit()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to save grade")
    } finally {
      setSaving(false)
    }
  }

  const getCourseName = (courseId: string) => {
    const c = courses.find((co) => co.courseId === courseId)
    return c ? c.name : courseId
  }

  return (
    <TeacherLayout title="Manage Grades">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading data...</div>
      ) : (
        <div className="space-y-6">
          {/* Course selector */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Select a course</span>
              <select
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={selectedCourseId}
                onChange={(e) => setSearchParams({ course: e.target.value })}
              >
                <option value="">Choose a course...</option>
                {assignments.map((a) => (
                  <option key={a._id} value={a.courseId}>
                    {getCourseName(a.courseId)} ({a.courseId}) - {a.semester}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Enrollments table */}
          {selectedCourseId && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                  Students in {getCourseName(selectedCourseId)}
                </h3>
              </div>

              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 font-medium">Student ID</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Grade</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loadingEnrollments ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Loading students...
                      </td>
                    </tr>
                  ) : enrollments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No students enrolled in this course.
                      </td>
                    </tr>
                  ) : (
                    enrollments.map((e) => (
                      <tr key={e._id} className="text-gray-900">
                        <td className="px-4 py-3">{e.studentId}</td>
                        <td className="px-4 py-3">
                          {e.student
                            ? `${e.student.firstName || ""} ${e.student.lastName || ""}`.trim() ||
                              e.studentId
                            : e.studentId}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={e.status} />
                        </td>
                        <td className="px-4 py-3">
                          {editingId === e.enrollmentId ? (
                            <input
                              type="number"
                              min={0}
                              max={20}
                              value={editGrade}
                              onChange={(ev) =>
                                setEditGrade(ev.target.value === "" ? "" : Number(ev.target.value))
                              }
                              className="w-20 rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-blue-500"
                              placeholder="0-20"
                            />
                          ) : e.grade !== null && e.grade !== undefined ? (
                            <span
                              className={`font-bold ${
                                e.grade >= 10 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {e.grade}/20
                            </span>
                          ) : (
                            <span className="text-gray-400">Not graded</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === e.enrollmentId ? (
                            <div className="flex gap-2">
                              <button
                                onClick={saveGrade}
                                disabled={saving}
                                className="rounded-md bg-green-50 px-2 py-1 text-xs text-green-600 hover:bg-green-100 disabled:opacity-60"
                              >
                                {saving ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEdit(e)}
                              className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100"
                            >
                              {e.grade !== null && e.grade !== undefined ? "Edit" : "Add Grade"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </TeacherLayout>
  )
}

function StatusBadge({ status }: { status: "enrolled" | "completed" | "dropped" }) {
  const styles = {
    enrolled: "bg-blue-50 text-blue-600",
    completed: "bg-green-50 text-green-600",
    dropped: "bg-red-50 text-red-600",
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}
