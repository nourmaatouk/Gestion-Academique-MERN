// Grade Service communique avec Course-Service pour les Enrollments
// Pour simplifier, on va directement manipuler les Enrollments

const axios = require('axios');

const COURSE_SERVICE_URL = process.env.COURSE_SERVICE_URL || 'http://localhost:3003/api/courses';

// Mettre à jour la note d'un enrollment
exports.updateGrade = async (req, res) => {
  try {
    const { enrollmentId, grade } = req.body;
    const { role, id: teacherId } = req.user;

    // Vérifier que c'est un teacher ou admin
    if (!['teacher', 'admin'].includes(role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Seuls les enseignants et administrateurs peuvent modifier les notes'
      });
    }

    // Appeler Course-Service pour mettre à jour l'enrollment
    const response = await axios.patch(
      `${COURSE_SERVICE_URL}/enrollments/${enrollmentId}`,
      { grade },
      { headers: { Authorization: req.headers.authorization } }
    );

    res.status(200).json({
      status: 'success',
      message: 'Note mise à jour avec succès',
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la mise à jour de la note',
      error: error.response?.data || error.message
    });
  }
};

// Obtenir les notes d'un étudiant
exports.getStudentGrades = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { role, id: userId } = req.user;

    // Vérifier les permissions
    if (role === 'student' && userId !== studentId) {
      return res.status(403).json({
        status: 'error',
        message: 'Vous ne pouvez voir que vos propres notes'
      });
    }

    // Appeler Course-Service pour les enrollments de l'étudiant
    const response = await axios.get(
      `${COURSE_SERVICE_URL}/enrollments/student/${studentId}`,
      { headers: { Authorization: req.headers.authorization } }
    );

    // Filtrer pour avoir seulement les notes
    const grades = response.data.data.enrollments
      .filter(e => e.grade !== null)
      .map(e => ({
        courseId: e.courseId,
        grade: e.grade,
        semester: e.semester,
        enrollmentDate: e.enrollmentDate
      }));

    // Calculer la moyenne
    const average = grades.length > 0
      ? grades.reduce((sum, g) => sum + g.grade, 0) / grades.length
      : null;

    res.status(200).json({
      status: 'success',
      data: {
        grades,
        average,
        count: grades.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des notes',
      error: error.response?.data || error.message
    });
  }
};

// Obtenir les notes d'un cours
exports.getCourseGrades = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Appeler Course-Service pour les enrollments du cours
    const response = await axios.get(
      `${COURSE_SERVICE_URL}/enrollments/course/${courseId}`,
      { headers: { Authorization: req.headers.authorization } }
    );

    // Statistiques
    const enrollments = response.data.data.enrollments;
    const withGrades = enrollments.filter(e => e.grade !== null);
    const average = withGrades.length > 0
      ? withGrades.reduce((sum, e) => sum + e.grade, 0) / withGrades.length
      : null;

    res.status(200).json({
      status: 'success',
      data: {
        enrollments,
        statistics: {
          total: enrollments.length,
          graded: withGrades.length,
          average,
          min: withGrades.length > 0 ? Math.min(...withGrades.map(e => e.grade)) : null,
          max: withGrades.length > 0 ? Math.max(...withGrades.map(e => e.grade)) : null
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des notes du cours',
      error: error.response?.data || error.message
    });
  }
};