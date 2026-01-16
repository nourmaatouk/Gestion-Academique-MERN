import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/auth/LoginPage"
import AdminDashboard from "./pages/admin/AdminDashboard"
import StudentsPage from "./pages/admin/StudentsPage"
import TeachersPage from "./pages/admin/TeachersPage"
import CoursesPage from "./pages/admin/CoursesPage"
import DepartmentsPage from "./pages/admin/DepartmentsPage"
import EnrollmentsPage from "./pages/admin/EnrollmentsPage"
import AssignmentsPage from "./pages/admin/AssignmentsPage"
import GradesPage from "./pages/admin/GradesPage"
import StudentDashboard from "./pages/student/StudentDashboard"
import StudentCoursesPage from "./pages/student/StudentCoursesPage"
import StudentGradesPage from "./pages/student/StudentGradesPage"
import TeacherDashboard from "./pages/teacher/TeacherDashboard"
import TeacherCoursesPage from "./pages/teacher/TeacherCoursesPage"
import TeacherGradesPage from "./pages/teacher/TeacherGradesPage"
import { token } from "./services/token"
import type { ReactNode } from "react"

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: ReactNode; allowedRoles?: string[] }) {
  const decoded = token.decode()
  
  if (!token.isValid()) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && decoded && !allowedRoles.includes(decoded.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = decoded.role === "admin" ? "/admin" : decoded.role === "teacher" ? "/teacher" : "/student"
    return <Navigate to={redirectPath} replace />
  }
  
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute allowedRoles={["admin"]}><StudentsPage /></ProtectedRoute>} />
        <Route path="/admin/teachers" element={<ProtectedRoute allowedRoles={["admin"]}><TeachersPage /></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={["admin"]}><CoursesPage /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={["admin"]}><DepartmentsPage /></ProtectedRoute>} />
        <Route path="/admin/enrollments" element={<ProtectedRoute allowedRoles={["admin"]}><EnrollmentsPage /></ProtectedRoute>} />
        <Route path="/admin/assignments" element={<ProtectedRoute allowedRoles={["admin"]}><AssignmentsPage /></ProtectedRoute>} />
        <Route path="/admin/grades" element={<ProtectedRoute allowedRoles={["admin"]}><GradesPage /></ProtectedRoute>} />

        {/* Teacher routes */}
        <Route path="/teacher" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/teacher/courses" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherCoursesPage /></ProtectedRoute>} />
        <Route path="/teacher/grades" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherGradesPage /></ProtectedRoute>} />

        {/* Student routes */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/courses" element={<ProtectedRoute allowedRoles={["student"]}><StudentCoursesPage /></ProtectedRoute>} />
        <Route path="/student/grades" element={<ProtectedRoute allowedRoles={["student"]}><StudentGradesPage /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
