const express = require('express');
const { updateGrade, getStudentGrades, getCourseGrades } = require('../controllers/gradeController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Toutes les routes protégées
router.use(protect);

// Mettre à jour une note (teacher/admin seulement)
router.patch('/update', restrictTo('teacher', 'admin'), updateGrade);

// Voir les notes d'un étudiant
router.get('/student/:studentId', getStudentGrades);

// Voir les notes d'un cours (teacher/admin seulement)
router.get('/course/:courseId', restrictTo('teacher', 'admin'), getCourseGrades);

module.exports = router;