import { useEffect, useState } from "react"
import StudentLayout from "../../components/layout/StudentLayout"
import { api } from "../../services/api"

interface EnrollmentSummary {
  total: number
  enrolled: number
  completed: number
}

interface GradeSummary {
  average: number | null
  graded: number
  pending: number
}

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [studentInfo, setStudentInfo] = useState<any>(null)
  const [enrollmentSummary, setEnrollmentSummary] = useState<EnrollmentSummary>({
    total: 0,
    enrolled: 0,
    completed: 0,
  })
  const [gradeSummary, setGradeSummary] = useState<GradeSummary>({
    average: null,
    graded: 0,
    pending: 0,
  })

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError(null)
      try {
        // Get student profile
        const profileRes = await api.get("/api/users/students/profile")
        const profile = profileRes.data.data || profileRes.data
        setStudentInfo(profile)

        // Get enrollments
        const enrollmentsRes = await api.get(`/api/courses/enrollments/student/${profile.studentId}`)
        const enrollmentsData = enrollmentsRes.data.data?.enrollments || enrollmentsRes.data.enrollments || enrollmentsRes.data.data || enrollmentsRes.data
        const enrollments = Array.isArray(enrollmentsData) ? enrollmentsData : []
        
        const enrolled = enrollments.filter((e: any) => e.status === "enrolled").length
        const completed = enrollments.filter((e: any) => e.status === "completed").length
        setEnrollmentSummary({
          total: enrollments.length,
          enrolled,
          completed,
        })

        // Calculate grade summary
        const graded = enrollments.filter((e: any) => e.grade !== null && e.grade !== undefined)
        const pending = enrollments.length - graded.length
        const avg = graded.length > 0
          ? graded.reduce((sum: number, e: any) => sum + e.grade, 0) / graded.length
          : null
        setGradeSummary({
          average: avg,
          graded: graded.length,
          pending,
        })
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  return (
    <StudentLayout title="Dashboard">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading dashboard...</div>
      ) : (
        <div className="space-y-6">
          {/* Welcome section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Welcome, {studentInfo?.firstName || "Student"}!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Student ID: {studentInfo?.studentId || "N/A"} • 
              Department: {studentInfo?.department || "N/A"} • 
              Level: {studentInfo?.niveau || "N/A"}
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Courses"
              value={enrollmentSummary.total}
              color="blue"
            />
            <StatCard
              title="Currently Enrolled"
              value={enrollmentSummary.enrolled}
              color="green"
            />
            <StatCard
              title="Completed"
              value={enrollmentSummary.completed}
              color="purple"
            />
            <StatCard
              title="Average Grade"
              value={gradeSummary.average !== null ? gradeSummary.average.toFixed(2) : "—"}
              subtitle={`${gradeSummary.graded} graded, ${gradeSummary.pending} pending`}
              color="orange"
            />
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="/student/courses"
                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                View My Courses
              </a>
              <a
                href="/student/grades"
                className="px-4 py-2 rounded-lg bg-green-50 text-green-600 text-sm font-medium hover:bg-green-100 transition-colors"
              >
                Check My Grades
              </a>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string
  value: string | number
  subtitle?: string
  color: "blue" | "green" | "purple" | "orange"
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      <div className={`text-2xl font-bold ${colors[color].split(" ")[1]}`}>{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  )
}
