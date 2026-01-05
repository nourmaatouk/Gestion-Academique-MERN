import { useEffect, useState } from "react"
import StudentLayout from "../../components/layout/StudentLayout"
import { getEnrollmentsByStudent } from "../../features/enrollments/enrollments.api"
import { getCourses } from "../../features/courses/courses.api"
import { api } from "../../services/api"
import type { Enrollment } from "../../features/enrollments/enrollments.types"
import type { Course } from "../../features/courses/courses.types"

interface EnrollmentWithCourse extends Enrollment {
  course?: Course
}

export default function StudentCoursesPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "enrolled" | "completed" | "dropped">("all")

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true)
      setError(null)
      try {
        // Get student profile first to get studentId
        const profileRes = await api.get("/api/users/students/profile")
        const profile = profileRes.data.data || profileRes.data

        // Get enrollments using typed API
        const enrollmentList = await getEnrollmentsByStudent(profile.studentId)

        // Get all courses using typed API
        const coursesList = await getCourses()

        // Combine enrollments with course data
        const combined = enrollmentList.map((e) => ({
          ...e,
          course: coursesList.find((c) => c.courseId === e.courseId),
        }))

        setEnrollments(combined)
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Failed to load courses")
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  const filtered = enrollments.filter((e) => filter === "all" || e.status === filter)

  return (
    <StudentLayout title="My Courses">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", "enrolled", "completed", "dropped"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== "all" && (
              <span className="ml-1 text-xs opacity-75">
                ({enrollments.filter((e) => e.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-500">Loading courses...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">No courses found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <div
              key={e._id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">
                  {e.course?.name || e.courseId}
                </h3>
                <StatusBadge status={e.status} />
              </div>
              
              <p className="text-xs text-gray-500 mb-3">
                {e.course?.courseId || e.courseId}
              </p>

              {e.course?.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {e.course.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {e.course?.credits || "?"} credits
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {e.course?.hours || "?"} hours
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {e.semester}
                </span>
              </div>

              {e.grade !== undefined && e.grade !== null && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Grade: </span>
                  <span className={`font-bold ${e.grade >= 10 ? "text-green-600" : "text-red-600"}`}>
                    {e.grade}/20
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </StudentLayout>
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
