import { useEffect, useState } from "react"
import StudentLayout from "../../components/layout/StudentLayout"
import { getEnrollmentsByStudent } from "../../features/enrollments/enrollments.api"
import { getCourses } from "../../features/courses/courses.api"
import { api } from "../../services/api"
import type { Enrollment } from "../../features/enrollments/enrollments.types"
import type { Course } from "../../features/courses/courses.types"

interface GradeEntry extends Enrollment {
  course?: Course
}

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<GradeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadGrades = async () => {
      setLoading(true)
      setError(null)
      try {
        // Get student profile to get studentId
        const profileRes = await api.get("/api/users/students/profile")
        const profile = profileRes.data.data || profileRes.data

        // Get enrollments using typed API
        const enrollmentList = await getEnrollmentsByStudent(profile.studentId)

        // Get courses using typed API
        const coursesList = await getCourses()

        // Combine with course data
        const combined = enrollmentList.map((e) => ({
          ...e,
          course: coursesList.find((c) => c.courseId === e.courseId),
        }))

        setGrades(combined)
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Failed to load grades")
      } finally {
        setLoading(false)
      }
    }

    loadGrades()
  }, [])

  // Calculate statistics
  const gradedEntries = grades.filter((g) => g.grade !== null && g.grade !== undefined)
  const totalCredits = gradedEntries.reduce((sum, g) => sum + (g.course?.credits || 0), 0)
  const weightedSum = gradedEntries.reduce(
    (sum, g) => sum + (g.grade || 0) * (g.course?.credits || 1),
    0
  )
  const gpa = totalCredits > 0 ? weightedSum / totalCredits : null
  const average =
    gradedEntries.length > 0
      ? gradedEntries.reduce((sum, g) => sum + (g.grade || 0), 0) / gradedEntries.length
      : null

  return (
    <StudentLayout title="My Grades">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading grades...</div>
      ) : (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="Simple Average"
              value={average !== null ? average.toFixed(2) : "—"}
              subtitle="/20"
              color={average !== null && average >= 10 ? "green" : "orange"}
            />
            <SummaryCard
              title="Weighted Average (GPA)"
              value={gpa !== null ? gpa.toFixed(2) : "—"}
              subtitle="/20"
              color={gpa !== null && gpa >= 10 ? "green" : "orange"}
            />
            <SummaryCard
              title="Courses Graded"
              value={gradedEntries.length}
              subtitle={`of ${grades.length} total`}
              color="blue"
            />
            <SummaryCard
              title="Credits Earned"
              value={totalCredits}
              subtitle="credits"
              color="purple"
            />
          </div>

          {/* Grades table */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Credits</th>
                  <th className="px-4 py-3 font-medium">Semester</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Grade</th>
                  <th className="px-4 py-3 font-medium">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {grades.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No grades available yet.
                    </td>
                  </tr>
                ) : (
                  grades.map((g) => (
                    <tr key={g._id} className="text-gray-900">
                      <td className="px-4 py-3">
                        <div className="font-medium">{g.course?.name || g.courseId}</div>
                        <div className="text-xs text-gray-500">{g.courseId}</div>
                      </td>
                      <td className="px-4 py-3">{g.course?.credits || "—"}</td>
                      <td className="px-4 py-3">{g.semester}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={g.status} />
                      </td>
                      <td className="px-4 py-3">
                        {g.grade !== null && g.grade !== undefined ? (
                          <span
                            className={`font-bold ${
                              g.grade >= 10 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {g.grade}/20
                          </span>
                        ) : (
                          <span className="text-gray-400">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {g.grade !== null && g.grade !== undefined ? (
                          g.grade >= 10 ? (
                            <span className="px-2 py-1 rounded bg-green-50 text-green-600 text-xs font-medium">
                              Passed
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded bg-red-50 text-red-600 text-xs font-medium">
                              Failed
                            </span>
                          )
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </StudentLayout>
  )
}

function SummaryCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string
  value: string | number
  subtitle: string
  color: "green" | "orange" | "blue" | "purple"
}) {
  const colors = {
    green: "text-green-600",
    orange: "text-orange-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${colors[color]}`}>{value}</span>
        <span className="text-sm text-gray-400">{subtitle}</span>
      </div>
    </div>
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
