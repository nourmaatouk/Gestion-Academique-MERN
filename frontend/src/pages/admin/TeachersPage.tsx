import { useEffect, useMemo, useState } from "react"
import AdminLayout from "../../components/layout/AdminLayout"
import { createTeacher, getTeachers, removeTeacher, updateTeacher } from "../../features/teachers/teachers.api"
import type { CreateTeacherPayload, Teacher, UpdateTeacherPayload } from "../../features/teachers/teachers.types"

export default function TeachersPage() {
  const [items, setItems] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // search
  const [q, setQ] = useState("")

  // create form
  const [form, setForm] = useState<CreateTeacherPayload>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    teacherId: "",
    specialite: "",
    department: "Informatique",
  })
  const [creating, setCreating] = useState(false)

  // edit inline
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<UpdateTeacherPayload>({})
  const [savingEdit, setSavingEdit] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getTeachers()
      setItems(data)
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to load teachers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter((t) => {
      const name = `${t.firstName ?? ""} ${t.lastName ?? ""}`.toLowerCase()
      return (
        (t.email ?? "").toLowerCase().includes(s) ||
        (t.teacherId ?? "").toLowerCase().includes(s) ||
        name.includes(s) ||
        (t.specialite ?? "").toLowerCase().includes(s)
      )
    })
  }, [q, items])

  const setField = (k: keyof CreateTeacherPayload, v: string) => setForm((p) => ({ ...p, [k]: v }))
  const setEditField = (k: keyof UpdateTeacherPayload, v: string) => setEditForm((p) => ({ ...p, [k]: v }))

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.email || !form.password || !form.firstName || !form.lastName || !form.teacherId || !form.specialite) {
      setError("Fill all required fields (*)")
      return
    }

    setCreating(true)
    try {
      const created = await createTeacher(form)
      setItems((prev) => [created, ...prev])
      setForm({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        teacherId: "",
        specialite: "",
        department: "Informatique",
      })
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Create teacher failed")
    } finally {
      setCreating(false)
    }
  }

  const startEdit = (t: Teacher) => {
    setEditingId(t._id)
    setEditForm({
      email: t.email,
      firstName: t.firstName,
      lastName: t.lastName,
      teacherId: t.teacherId,
      specialite: t.specialite,
      department: t.department,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const saveEdit = async () => {
    if (!editingId) return
    setError(null)
    setSavingEdit(true)
    try {
      const updated = await updateTeacher(editingId, editForm)
      setItems((prev) => prev.map((x) => (x._id === editingId ? updated : x)))
      cancelEdit()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Update failed")
    } finally {
      setSavingEdit(false)
    }
  }

  const onDelete = async (id: string) => {
    const ok = confirm("Delete this teacher?")
    if (!ok) return
    setError(null)
    try {
      await removeTeacher(id)
      setItems((prev) => prev.filter((x) => x._id !== id))
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Delete failed")
    }
  }

  return (
    <AdminLayout title="Teachers">
      {/* top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full sm:max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Search (name, email, teacherId...)"
        />
        <button
          onClick={load}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* error */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* create form */}
      <form onSubmit={onCreate} className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm font-semibold text-gray-900">Add teacher</div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="First name *">
            <input className="input" value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} />
          </Field>
          <Field label="Last name *">
            <input className="input" value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} />
          </Field>

          <Field label="Email *">
            <input className="input" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} />
          </Field>
          <Field label="Password *">
            <input className="input" type="password" value={form.password} onChange={(e) => setField("password", e.target.value)} />
          </Field>

          <Field label="Teacher ID *">
            <input className="input" value={form.teacherId} onChange={(e) => setField("teacherId", e.target.value)} />
          </Field>
          <Field label="Specialité *">
            <input className="input" value={form.specialite} onChange={(e) => setField("specialite", e.target.value)} />
          </Field>

          <Field label="Department">
            <input className="input" value={form.department ?? ""} onChange={(e) => setField("department", e.target.value)} />
          </Field>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            disabled={creating}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            onClick={() =>
              setForm({
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                teacherId: "",
                specialite: "",
                department: "Informatique",
              })
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </form>

      {/* table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">TeacherId</th>
              <th className="px-3 py-2 font-medium">Spécialité</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-gray-500">
                  No teachers found.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t._id} className="text-gray-900">
                  <td className="px-3 py-2">{`${t.firstName ?? ""} ${t.lastName ?? ""}`}</td>
                  <td className="px-3 py-2">{t.email ?? "—"}</td>
                  <td className="px-3 py-2">{t.teacherId}</td>
                  <td className="px-3 py-2">{t.specialite}</td>
                  <td className="px-3 py-2">
                    {editingId === t._id ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={saveEdit}
                          disabled={savingEdit}
                          className="rounded-md bg-green-50 px-2 py-1 text-xs text-green-600 hover:bg-green-100 disabled:opacity-60"
                        >
                          {savingEdit ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => startEdit(t)}
                          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(t._id)}
                          className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* edit panel */}
      {editingId && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 text-sm font-semibold text-gray-900">Edit teacher</div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="First name">
              <input className="input" value={editForm.firstName ?? ""} onChange={(e) => setEditField("firstName", e.target.value)} />
            </Field>
            <Field label="Last name">
              <input className="input" value={editForm.lastName ?? ""} onChange={(e) => setEditField("lastName", e.target.value)} />
            </Field>
            <Field label="Email">
              <input className="input" type="email" value={editForm.email ?? ""} onChange={(e) => setEditField("email", e.target.value)} />
            </Field>
            <Field label="Teacher ID">
              <input className="input" value={editForm.teacherId ?? ""} onChange={(e) => setEditField("teacherId", e.target.value)} />
            </Field>
            <Field label="Spécialité">
              <input className="input" value={editForm.specialite ?? ""} onChange={(e) => setEditField("specialite", e.target.value)} />
            </Field>
            <Field label="Department">
              <input className="input" value={editForm.department ?? ""} onChange={(e) => setEditField("department", e.target.value)} />
            </Field>
          </div>
        </div>
      )}

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          background: white;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #111827;
          outline: none;
        }
        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }
      `}</style>
    </AdminLayout>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs text-gray-600">{label}</div>
      {children}
    </label>
  )
}
