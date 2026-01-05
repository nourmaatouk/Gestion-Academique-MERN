import AdminLayout from "../../components/layout/AdminLayout"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { getStudents } from "../../features/students/students.api"
import { getTeachers } from "../../features/teachers/teachers.api"
import { getCourses } from "../../features/courses/courses.api"
import { departmentsApi } from "../../features/departments/departments.api"

const cards = [
  { title: "Students", desc: "CRUD students", to: "/admin/students" },
  { title: "Teachers", desc: "CRUD teachers", to: "/admin/teachers" },
  { title: "Courses", desc: "CRUD courses", to: "/admin/courses" },
  { title: "Departments", desc: "Manage departments", to: "/admin/departments" },
  { title: "Enrollments", desc: "Enroll students in courses", to: "/admin/enrollments" },
  { title: "Assignments", desc: "Assign teachers to courses", to: "/admin/assignments" },
  { title: "Grades", desc: "View and manage student grades", to: "/admin/grades" },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0, departments: 0 })

  useEffect(() => {
    Promise.all([getStudents(), getTeachers(), getCourses(), departmentsApi.getAll()])
      .then(([s, t, c, d]) => setStats({
        students: Array.isArray(s) ? s.length : 0,
        teachers: Array.isArray(t) ? t.length : 0,
        courses: Array.isArray(c) ? c.length : 0,
        departments: Array.isArray(d) ? d.length : 0
      }))
      .catch(() => {})
  }, [])

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <div className="bg-white rounded-lg border p-4"><span className="text-gray-500">Students:</span> <strong>{stats.students}</strong></div>
        <div className="bg-white rounded-lg border p-4"><span className="text-gray-500">Teachers:</span> <strong>{stats.teachers}</strong></div>
        <div className="bg-white rounded-lg border p-4"><span className="text-gray-500">Courses:</span> <strong>{stats.courses}</strong></div>
        <div className="bg-white rounded-lg border p-4"><span className="text-gray-500">Departments:</span> <strong>{stats.departments}</strong></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
          >
            <div className="text-base font-semibold text-gray-900">{c.title}</div>
            <div className="mt-1 text-sm text-gray-500">{c.desc}</div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  )
}
