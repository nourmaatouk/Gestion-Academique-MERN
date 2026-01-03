const express = require('express');
const { 
  getAllStudents, 
  getStudent, 
  createStudent, 
  updateStudent, 
  deleteStudent,
  getAllTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher
} = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Toutes les routes protégées
router.use(protect);

//  ROUTES STUDENTS
router.get('/students', restrictTo('admin', 'teacher'), getAllStudents);
router.get('/students/:id', restrictTo('admin', 'teacher', 'student'), getStudent);
router.post('/students', restrictTo('admin'), createStudent);
router.patch('/students/:id', restrictTo('admin'), updateStudent);
router.delete('/students/:id', restrictTo('admin'), deleteStudent);

//  ROUTES TEACHERS 
router.get('/teachers', restrictTo('admin'), getAllTeachers);
router.get('/teachers/:id', restrictTo('admin'), getTeacher);
router.post('/teachers', restrictTo('admin'), createTeacher);
router.patch('/teachers/:id', restrictTo('admin'), updateTeacher);
router.delete('/teachers/:id', restrictTo('admin'), deleteTeacher);

module.exports = router;