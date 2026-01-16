import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { departmentsApi } from "../../features/departments/departments.api";
import type { Department, CreateDepartmentData } from "../../features/departments/departments.types";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState<CreateDepartmentData>({
    deptId: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await departmentsApi.getAll();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error loading departments:", error);
      setError(error?.response?.data?.message || error?.message || "Failed to load departments");
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingDept) {
        await departmentsApi.update(editingDept._id, formData);
      } else {
        await departmentsApi.create(formData);
      }
      setShowModal(false);
      setEditingDept(null);
      setFormData({ deptId: "", name: "", description: "" });
      loadDepartments();
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || "Failed to save department");
    }
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({
      deptId: dept.deptId,
      name: dept.name,
      description: dept.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    setError(null);
    try {
      await departmentsApi.delete(id);
      loadDepartments();
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || "Failed to delete department");
    }
  };

  const openCreateModal = () => {
    setEditingDept(null);
    setFormData({ deptId: "", name: "", description: "" });
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Department
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No departments found
                    </td>
                  </tr>
                ) : (
                  departments.map((dept) => (
                    <tr key={dept._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dept.deptId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dept.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {dept.description || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dept.createdAt ? new Date(dept.createdAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEdit(dept)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dept._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                {editingDept ? "Edit Department" : "Add Department"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department ID
                  </label>
                  <input
                    type="text"
                    value={formData.deptId}
                    onChange={(e) => setFormData({ ...formData, deptId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., DEPT-CS"
                    required
                    disabled={!!editingDept}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Department description..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingDept(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {editingDept ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
