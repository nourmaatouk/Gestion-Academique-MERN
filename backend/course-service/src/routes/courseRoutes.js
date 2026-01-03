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
  
  // Enrollments
  createEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  updateEnrollment, 
  
  // Course Assignments
  assignTeacherToCourse,
  getCoursesByTeacher
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

// 📝 ROUTES ENROLLMENTS
router.post('/enrollments', restrictTo('admin'), createEnrollment);
router.get('/enrollments/student/:studentId', restrictTo('admin', 'teacher'), getEnrollmentsByStudent);
router.get('/enrollments/course/:courseId', restrictTo('admin', 'teacher'), getEnrollmentsByCourse);
router.patch('/enrollments/:enrollmentId', restrictTo('admin', 'teacher'), updateEnrollment);

// 👨‍🏫 ROUTES COURSE ASSIGNMENTS
router.post('/assignments', restrictTo('admin'), assignTeacherToCourse);
router.get('/assignments/teacher/:teacherId', restrictTo('admin', 'teacher'), getCoursesByTeacher);

module.exports = router;