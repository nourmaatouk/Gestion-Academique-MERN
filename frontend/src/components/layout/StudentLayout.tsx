import type { ReactNode } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { token } from "../../services/token"

interface StudentLayoutProps {
  title: string
  children: ReactNode
}

export default function StudentLayout({ title, children }: StudentLayoutProps) {
  const navigate = useNavigate()
  const decoded = token.decode()

  const handleLogout = () => {
    token.clear()
    navigate("/login")
  }

  const links = [
    { to: "/student", label: "Dashboard", exact: true },
    { to: "/student/courses", label: "My Courses" },
    { to: "/student/grades", label: "My Grades" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Student Portal</h2>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {decoded?.email || "Student"}
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </header>
        {children}
      </main>
    </div>
  )
}
