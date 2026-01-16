import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { gradesApi } from "../../features/grades/grades.api";
import { getCourses } from "../../features/courses/courses.api";
import { getStudents } from "../../features/students/students.api";
import type { CourseGradesResponse } from "../../features/grades/grades.types";
import type { Course } from "../../features/courses/courses.types";
import type { Student } from "../../features/students/students.types";

export default function GradesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [courseGrades, setCourseGrades] = useState<CourseGradesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<{ id: string; grade: number }>({ id: "", grade: 0 });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [coursesData, studentsData] = await Promise.all([
        getCourses(),
        getStudents(),
      ]);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const loadCourseGrades = async (courseId: string) => {
    if (!courseId) {
      setCourseGrades(null);
      return;
    }
    try {
      setLoading(true);
      const data = await gradesApi.getCourseGrades(courseId);
      setCourseGrades(data);
    } catch (error) {
      console.error("Error loading grades:", error);
      setCourseGrades(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    loadCourseGrades(courseId);
  };

  const getStudentInfo = (studentId: string): { name: string; email: string } => {
    const student = students.find((s) => s._id === studentId || s.studentId === studentId);
    if (student) {
      return {
        name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || studentId,
        email: student.email || '-'
      };
    }
    return { name: studentId, email: '-' };
  };

  const handleEditGrade = (enrollmentId: string, currentGrade: number | null) => {
    setEditingEnrollment({ id: enrollmentId, grade: currentGrade || 0 });
    setShowEditModal(true);
  };

  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await gradesApi.updateGrade({
        enrollmentId: editingEnrollment.id,
        grade: editingEnrollment.grade,
      });
      setShowEditModal(false);
      loadCourseGrades(selectedCourse);
    } catch (error) {
      console.error("Error updating grade:", error);
    }
  };

  const getGradeColor = (grade: number | null): string => {
    if (grade === null) return "text-gray-400";
    if (grade >= 16) return "text-green-600";
    if (grade >= 12) return "text-blue-600";
    if (grade >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Grades Management</h1>
        </div>

        {/* Course Selector */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select a course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course.courseId}>
                {course.courseId} - {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* Statistics */}
        {courseGrades && courseGrades.statistics && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{courseGrades.statistics.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Graded</p>
              <p className="text-2xl font-bold text-blue-600">{courseGrades.statistics.graded}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Average</p>
              <p className="text-2xl font-bold text-gray-900">
                {courseGrades.statistics.average?.toFixed(2) || "-"}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Min</p>
              <p className="text-2xl font-bold text-red-600">
                {courseGrades.statistics.min?.toFixed(2) || "-"}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Max</p>
              <p className="text-2xl font-bold text-green-600">
                {courseGrades.statistics.max?.toFixed(2) || "-"}
              </p>
            </div>
          </div>
        )}

        {/* Grades Table */}
        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading...</div>
        ) : selectedCourse && courseGrades ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!courseGrades.enrollments || courseGrades.enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No enrollments found for this course
                    </td>
                  </tr>
                ) : (
                  courseGrades.enrollments.map((enrollment) => {
                    const studentInfo = getStudentInfo(enrollment.studentId);
                    return (
                    <tr key={enrollment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {studentInfo.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {studentInfo.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {enrollment.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-lg font-bold ${getGradeColor(enrollment.grade)}`}>
                          {enrollment.grade !== null ? enrollment.grade.toFixed(2) : "Not graded"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEditGrade(enrollment.enrollmentId, enrollment.grade)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {enrollment.grade !== null ? "Edit" : "Add Grade"}
                        </button>
                      </td>
                    </tr>
                  );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Select a course to view and manage grades
          </div>
        )}

        {/* Edit Grade Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Update Grade</h2>
              <form onSubmit={handleSubmitGrade} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade (0-20)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.01"
                    value={editingEnrollment.grade}
                    onChange={(e) =>
                      setEditingEnrollment({ ...editingEnrollment, grade: parseFloat(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save
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
