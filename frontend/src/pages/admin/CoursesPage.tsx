import { useEffect, useMemo, useState } from "react"
import AdminLayout from "../../components/layout/AdminLayout"
import { createCourse, getCourses, removeCourse, updateCourse } from "../../features/courses/courses.api"
import type { Course, CreateCoursePayload, UpdateCoursePayload } from "../../features/courses/courses.types"

export default function CoursesPage() {
  const [items, setItems] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // search
  const [q, setQ] = useState("")

  // create form
  const [form, setForm] = useState<CreateCoursePayload>({
    courseId: "",
    name: "",
    description: "",
    credits: 3,
    hours: 30,
    department: "Informatique",
  })
  const [creating, setCreating] = useState(false)

  // edit inline
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<UpdateCoursePayload>({})
  const [savingEdit, setSavingEdit] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCourses()
      setItems(data)
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to load courses")
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
    return items.filter((c) => {
      return (
        (c.courseId ?? "").toLowerCase().includes(s) ||
        (c.name ?? "").toLowerCase().includes(s) ||
        (c.department ?? "").toLowerCase().includes(s)
      )
    })
  }, [q, items])

  const setField = <K extends keyof CreateCoursePayload>(k: K, v: CreateCoursePayload[K]) =>
    setForm((p) => ({ ...p, [k]: v }))
  const setEditField = <K extends keyof UpdateCoursePayload>(k: K, v: UpdateCoursePayload[K]) =>
    setEditForm((p) => ({ ...p, [k]: v }))

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.courseId || !form.name || !form.credits || !form.hours || !form.department) {
      setError("Fill all required fields (*)")
      return
    }

    setCreating(true)
    try {
      const created = await createCourse(form)
      setItems((prev) => [created, ...prev])
      setForm({
        courseId: "",
        name: "",
        description: "",
        credits: 3,
        hours: 30,
        department: "Informatique",
      })
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Create course failed")
    } finally {
      setCreating(false)
    }
  }

  const startEdit = (c: Course) => {
    setEditingId(c._id)
    setEditForm({
      courseId: c.courseId,
      name: c.name,
      description: c.description,
      credits: c.credits,
      hours: c.hours,
      department: c.department,
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
      const updated = await updateCourse(editingId, editForm)
      setItems((prev) => prev.map((x) => (x._id === editingId ? updated : x)))
      cancelEdit()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Update failed")
    } finally {
      setSavingEdit(false)
    }
  }

  const onDelete = async (id: string) => {
    const ok = confirm("Delete this course?")
    if (!ok) return
    setError(null)
    try {
      await removeCourse(id)
      setItems((prev) => prev.filter((x) => x._id !== id))
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Delete failed")
    }
  }

  return (
    <AdminLayout title="Courses">
      {/* top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full sm:max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Search (name, courseId, department...)"
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
        <div className="mb-3 text-sm font-semibold text-gray-900">Add course</div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Course ID *">
            <input className="input" value={form.courseId} onChange={(e) => setField("courseId", e.target.value)} />
          </Field>
          <Field label="Name *">
            <input className="input" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          </Field>
          <Field label="Department *">
            <input className="input" value={form.department} onChange={(e) => setField("department", e.target.value)} />
          </Field>
          <Field label="Credits * (1-6)">
            <input
              className="input"
              type="number"
              min={1}
              max={6}
              value={form.credits}
              onChange={(e) => setField("credits", Number(e.target.value))}
            />
          </Field>
          <Field label="Hours *">
            <input
              className="input"
              type="number"
              min={1}
              value={form.hours}
              onChange={(e) => setField("hours", Number(e.target.value))}
            />
          </Field>
          <Field label="Description">
            <input className="input" value={form.description ?? ""} onChange={(e) => setField("description", e.target.value)} />
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
                courseId: "",
                name: "",
                description: "",
                credits: 3,
                hours: 30,
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
              <th className="px-3 py-2 font-medium">Course ID</th>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Department</th>
              <th className="px-3 py-2 font-medium">Credits</th>
              <th className="px-3 py-2 font-medium">Hours</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-gray-500">
                  No courses found.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c._id} className="text-gray-900">
                  <td className="px-3 py-2">{c.courseId}</td>
                  <td className="px-3 py-2">{c.name}</td>
                  <td className="px-3 py-2">{c.department}</td>
                  <td className="px-3 py-2">{c.credits}</td>
                  <td className="px-3 py-2">{c.hours}</td>
                  <td className="px-3 py-2">
                    {editingId === c._id ? (
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
                          onClick={() => startEdit(c)}
                          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(c._id)}
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
          <div className="mb-3 text-sm font-semibold text-gray-900">Edit course</div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Course ID">
              <input className="input" value={editForm.courseId ?? ""} onChange={(e) => setEditField("courseId", e.target.value)} />
            </Field>
            <Field label="Name">
              <input className="input" value={editForm.name ?? ""} onChange={(e) => setEditField("name", e.target.value)} />
            </Field>
            <Field label="Department">
              <input className="input" value={editForm.department ?? ""} onChange={(e) => setEditField("department", e.target.value)} />
            </Field>
            <Field label="Credits (1-6)">
              <input
                className="input"
                type="number"
                min={1}
                max={6}
                value={editForm.credits ?? ""}
                onChange={(e) => setEditField("credits", Number(e.target.value))}
              />
            </Field>
            <Field label="Hours">
              <input
                className="input"
                type="number"
                min={1}
                value={editForm.hours ?? ""}
                onChange={(e) => setEditField("hours", Number(e.target.value))}
              />
            </Field>
            <Field label="Description">
              <input className="input" value={editForm.description ?? ""} onChange={(e) => setEditField("description", e.target.value)} />
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
