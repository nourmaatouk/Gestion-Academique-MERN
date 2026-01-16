import { useEffect, useState } from "react"
import TeacherLayout from "../../components/layout/TeacherLayout"
import { api } from "../../services/api"

interface AssignmentSummary {
  total: number
  currentSemester: number
}

interface CourseSummary {
  totalStudents: number
  pendingGrades: number
}

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [teacherInfo, setTeacherInfo] = useState<any>(null)
  const [assignmentSummary, setAssignmentSummary] = useState<AssignmentSummary>({
    total: 0,
    currentSemester: 0,
  })
  const [courseSummary, setCourseSummary] = useState<CourseSummary>({
    totalStudents: 0,
    pendingGrades: 0,
  })

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError(null)
      try {
        // Get teacher profile
        const profileRes = await api.get("/api/users/teachers/profile")
        const profile = profileRes.data.data || profileRes.data
        setTeacherInfo(profile)

        // Get assignments for this teacher
        const assignmentsRes = await api.get(`/api/courses/assignments/teacher/${profile.teacherId}`)
        const assignmentsData = assignmentsRes.data.data?.assignments || assignmentsRes.data.assignments || assignmentsRes.data.data || assignmentsRes.data
        const assignments = Array.isArray(assignmentsData) ? assignmentsData : []
        
        const currentSemester = assignments.filter((a: any) => 
          a.semester?.includes("2025-2026")
        ).length

        setAssignmentSummary({
          total: assignments.length,
          currentSemester,
        })

        // Get enrollments for courses this teacher teaches
        let totalStudents = 0
        let pendingGrades = 0
        
        for (const assignment of assignments) {
          try {
            const enrollmentsRes = await api.get(`/api/courses/enrollments/course/${assignment.courseId}`)
            const enrollmentsData = enrollmentsRes.data.data?.enrollments || enrollmentsRes.data.enrollments || enrollmentsRes.data.data || enrollmentsRes.data
            const enrollments = Array.isArray(enrollmentsData) ? enrollmentsData : []
            totalStudents += enrollments.length
            pendingGrades += enrollments.filter((e: any) => 
              e.grade === null || e.grade === undefined
            ).length
          } catch {
            // Skip if course enrollments fail
          }
        }

        setCourseSummary({
          totalStudents,
          pendingGrades,
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
    <TeacherLayout title="Dashboard">
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
              Welcome, {teacherInfo?.firstName || "Teacher"}!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Teacher ID: {teacherInfo?.teacherId || "N/A"} • 
              Spécialité: {teacherInfo?.specialite || "N/A"} • 
              Department: {teacherInfo?.department || "N/A"}
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Courses"
              value={assignmentSummary.total}
              color="blue"
            />
            <StatCard
              title="Current Semester"
              value={assignmentSummary.currentSemester}
              subtitle="courses"
              color="green"
            />
            <StatCard
              title="Total Students"
              value={courseSummary.totalStudents}
              color="purple"
            />
            <StatCard
              title="Pending Grades"
              value={courseSummary.pendingGrades}
              subtitle="to enter"
              color="orange"
            />
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="/teacher/courses"
                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                View My Courses
              </a>
              <a
                href="/teacher/grades"
                className="px-4 py-2 rounded-lg bg-green-50 text-green-600 text-sm font-medium hover:bg-green-100 transition-colors"
              >
                Manage Grades
              </a>
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
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
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      <div className={`text-2xl font-bold ${colors[color]}`}>{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  )
}
