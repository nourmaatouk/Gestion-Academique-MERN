import type { ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { token } from "../../services/token"

type Props = {
  title?: string
  children: ReactNode
}

export default function AdminLayout({ title, children }: Props) {
  const nav = useNavigate()
  const location = useLocation()

  const logout = () => {
    token.clear()
    nav("/login", { replace: true })
  }

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-blue-50 text-blue-600 font-medium"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white">
        <div className="px-6 py-5 text-lg font-bold border-b border-gray-200 text-gray-900">
          Admin Panel
        </div>

        <nav className="p-3 space-y-1 text-sm">
          <SidebarLink to="/admin" label="Dashboard" active={isActive("/admin")} />
          <SidebarLink to="/admin/students" label="Students" active={isActive("/admin/students")} />
          <SidebarLink to="/admin/teachers" label="Teachers" active={isActive("/admin/teachers")} />
          <SidebarLink to="/admin/courses" label="Courses" active={isActive("/admin/courses")} />
          <SidebarLink to="/admin/departments" label="Departments" active={isActive("/admin/departments")} />
          <SidebarLink to="/admin/enrollments" label="Enrollments" active={isActive("/admin/enrollments")} />
          <SidebarLink to="/admin/assignments" label="Assignments" active={isActive("/admin/assignments")} />
          <SidebarLink to="/admin/grades" label="Grades" active={isActive("/admin/grades")} />
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-gray-900">
            {title || "Admin"}
          </h1>

          <button
            onClick={logout}
            className="text-sm px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
          >
            Logout
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarLink({
  to,
  label,
  active,
}: {
  to: string
  label: string
  active: string
}) {
  return (
    <Link
      to={to}
      className={`block rounded-lg px-3 py-2 transition ${active}`}
    >
      {label}
    </Link>
  )
}
