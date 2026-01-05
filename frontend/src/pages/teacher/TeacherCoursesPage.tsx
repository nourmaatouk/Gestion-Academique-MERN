import { useEffect, useState } from "react"
import TeacherLayout from "../../components/layout/TeacherLayout"
import { getAssignmentsByTeacher } from "../../features/assignments/assignments.api"
import { getCourses } from "../../features/courses/courses.api"
import { getEnrollmentsByCourse } from "../../features/enrollments/enrollments.api"
import { getStudents } from "../../features/students/students.api"
import { api } from "../../services/api"
import type { CourseAssignment } from "../../features/assignments/assignments.types"
import type { Course } from "../../features/courses/courses.types"
import type { Enrollment } from "../../features/enrollments/enrollments.types"
import type { Student } from "../../features/students/students.types"

interface AssignmentWithCourse extends CourseAssignment {
  course?: Course
  enrollmentCount?: number
  enrollments?: Enrollment[]
}

export default function TeacherCoursesPage() {
  const [assignments, setAssignments] = useState<AssignmentWithCourse[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true)
      setError(null)
      try {
        // Get teacher profile to get teacherId
        const profileRes = await api.get("/api/users/teachers/profile")
        const profile = profileRes.data.data || profileRes.data

        // Get assignments for this teacher using typed API
        const assignmentList = await getAssignmentsByTeacher(profile.teacherId)

        // Get all courses using typed API
        const coursesList = await getCourses()

        // Get all students
        const studentsList = await getStudents()
        setStudents(studentsList)

        // Combine assignments with course data and get enrollment count
        const combined: AssignmentWithCourse[] = []
        
        for (const a of assignmentList) {
          const course = coursesList.find((c) => c.courseId === a.courseId)
          let enrollmentCount = 0
          let enrollments: Enrollment[] = []
          
          try {
            enrollments = await getEnrollmentsByCourse(a.courseId)
            enrollmentCount = enrollments.length
          } catch {
            // Skip if enrollment fetch fails
          }

          combined.push({
            ...a,
            course,
            enrollmentCount,
            enrollments,
          })
        }

        setAssignments(combined)
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Failed to load courses")
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  const getStudentInfo = (studentId: string) => {
    const s = students.find((st) => st.studentId === studentId)
    return {
      name: s ? `${s.firstName || ""} ${s.lastName || ""}`.trim() || s.studentId : studentId,
      email: s?.email || "—"
    }
  }

  const toggleExpand = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId)
  }

  return (
    <TeacherLayout title="My Courses">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading courses...</div>
      ) : assignments.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">No courses assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assignments.map((a) => (
            <div
              key={a._id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">
                  {a.course?.name || a.courseId}
                </h3>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-medium">
                  {a.semester}
                </span>
              </div>
              
              <p className="text-xs text-gray-500 mb-3">
                {a.course?.courseId || a.courseId}
              </p>

              {a.course?.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {a.course.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {a.course?.credits || "?"} credits
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {a.course?.hours || "?"} hours
                </span>
                <button
                  onClick={() => toggleExpand(a.courseId)}
                  className="px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                >
                  {a.enrollmentCount} students {expandedCourse === a.courseId ? "▲" : "▼"}
                </button>
              </div>

              {/* Expanded student list */}
              {expandedCourse === a.courseId && a.enrollments && a.enrollments.length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Enrolled Students:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {a.enrollments.map((e) => {
                      const info = getStudentInfo(e.studentId)
                      return (
                        <div key={e._id} className="flex justify-between items-center text-xs">
                          <span className="font-medium text-gray-800">{info.name}</span>
                          <span className="text-gray-500">{info.email}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              
              {expandedCourse === a.courseId && (!a.enrollments || a.enrollments.length === 0) && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500">No students enrolled yet.</p>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-100">
                <a
                  href={`/teacher/grades?course=${a.courseId}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Manage Grades →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </TeacherLayout>
  )
}
