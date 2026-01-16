import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../../services/api"
import { token } from "../../services/token"

export default function LoginPage() {
  const nav = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"student" | "teacher" | "admin">("student")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Please enter your email and password")
      return
    }

    setLoading(true)
    try {
      const res = await api.post("/api/auth/login", { email, password })
      const data = res.data.data || res.data
      const jwt = data.token
      const userRole = data.user?.role

      // Check if selected role matches user's actual role
      if (userRole && userRole !== role) {
        setError(`You are not a ${role}, you are a ${userRole}. Please select the correct role.`)
        setLoading(false)
        return
      }

      token.set(jwt)

      // redirect based on user's actual role from server
      if (userRole === "admin") {
        nav("/admin", { replace: true })
      } else if (userRole === "teacher") {
        nav("/teacher", { replace: true })
      } else {
        nav("/student", { replace: true })
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion Académique</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "student" | "teacher" | "admin")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Demo accounts:</p>
          <p className="mt-1">admin@test.com / teacher@test.com / student@test.com</p>
          <p className="text-gray-400">password: password123</p>
        </div>
      </div>
    </div>
  )
}
