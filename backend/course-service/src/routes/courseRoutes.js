const express = require('express');
const { 
  // Courses
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  
  // Departments
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  
  // Enrollments
  getAllEnrollments,
  createEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  updateEnrollment,
  deleteEnrollment,
  
  // Course Assignments
  getAllAssignments,
  assignTeacherToCourse,
  getCoursesByTeacher,
  updateAssignment,
  deleteAssignment
} = require('../controllers/courseController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// 🔒 Toutes les routes protégées
router.use(protect);

// 📚 ROUTES COURSES
router.get('/courses', getAllCourses);
router.get('/courses/:id', getCourse);
router.post('/courses', restrictTo('admin'), createCourse);
router.patch('/courses/:id', restrictTo('admin'), updateCourse);
router.delete('/courses/:id', restrictTo('admin'), deleteCourse);

// 🏛️ ROUTES DEPARTMENTS
router.get('/departments', getAllDepartments);
router.post('/departments', restrictTo('admin'), createDepartment);
router.patch('/departments/:id', restrictTo('admin'), updateDepartment);
router.delete('/departments/:id', restrictTo('admin'), deleteDepartment);

// 📝 ROUTES ENROLLMENTS
router.get('/enrollments', restrictTo('admin'), getAllEnrollments);
router.post('/enrollments', restrictTo('admin'), createEnrollment);
router.get('/enrollments/student/:studentId', restrictTo('admin', 'teacher', 'student'), getEnrollmentsByStudent);
router.get('/enrollments/course/:courseId', restrictTo('admin', 'teacher'), getEnrollmentsByCourse);
router.patch('/enrollments/:enrollmentId', restrictTo('admin', 'teacher'), updateEnrollment);
router.delete('/enrollments/:enrollmentId', restrictTo('admin'), deleteEnrollment);

// 👨‍🏫 ROUTES COURSE ASSIGNMENTS
router.get('/assignments', restrictTo('admin'), getAllAssignments);
router.post('/assignments', restrictTo('admin'), assignTeacherToCourse);
router.get('/assignments/teacher/:teacherId', restrictTo('admin', 'teacher'), getCoursesByTeacher);
router.patch('/assignments/:id', restrictTo('admin'), updateAssignment);
router.delete('/assignments/:id', restrictTo('admin'), deleteAssignment);

module.exports = router;