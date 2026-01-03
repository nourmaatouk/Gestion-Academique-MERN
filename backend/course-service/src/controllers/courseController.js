const Course = require('../models/Course');
const Department = require('../models/Department');
const Enrollment = require('../models/Enrollment');
const CourseAssignment = require('../models/CourseAssignment');

// 📚 CRUD COURSES
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    
    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: { courses }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des cours',
      error: error.message
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Cours non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { course }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération du cours',
      error: error.message
    });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { courseId, name, description, credits, hours, department } = req.body;

    const newCourse = await Course.create({
      courseId,
      name,
      description,
      credits,
      hours,
      department
    });

    res.status(201).json({
      status: 'success',
      message: 'Cours créé avec succès',
      data: { course: newCourse }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Un cours avec cet ID existe déjà'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la création du cours',
      error: error.message
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Cours non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Cours modifié avec succès',
      data: { course }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la modification du cours',
      error: error.message
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Cours non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Cours supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression du cours',
      error: error.message
    });
  }
};

// 🏛️ CRUD DEPARTMENTS
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    
    res.status(200).json({
      status: 'success',
      results: departments.length,
      data: { departments }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des départements',
      error: error.message
    });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { deptId, name, description } = req.body;

    const newDepartment = await Department.create({
      deptId,
      name,
      description
    });

    res.status(201).json({
      status: 'success',
      message: 'Département créé avec succès',
      data: { department: newDepartment }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Un département avec cet ID existe déjà'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la création du département',
      error: error.message
    });
  }
};

// 📝 CRUD ENROLLMENTS
exports.createEnrollment = async (req, res) => {
  try {
    const { enrollmentId, studentId, courseId, semester } = req.body;

    // Vérifier si le cours existe
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Cours non trouvé'
      });
    }

    const newEnrollment = await Enrollment.create({
      enrollmentId,
      studentId,
      courseId,
      semester
    });

    res.status(201).json({
      status: 'success',
      message: 'Inscription créée avec succès',
      data: { enrollment: newEnrollment }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Cet étudiant est déjà inscrit à ce cours'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la création de l\'inscription',
      error: error.message
    });
  }
};

exports.getEnrollmentsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const enrollments = await Enrollment.find({ studentId })
      .populate('courseId', 'name credits');

    res.status(200).json({
      status: 'success',
      results: enrollments.length,
      data: { enrollments }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des inscriptions',
      error: error.message
    });
  }
};

exports.getEnrollmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const enrollments = await Enrollment.find({ courseId });

    res.status(200).json({
      status: 'success',
      results: enrollments.length,
      data: { enrollments }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des étudiants inscrits',
      error: error.message
    });
  }
};

// 👨‍🏫 CRUD COURSE ASSIGNMENTS
exports.assignTeacherToCourse = async (req, res) => {
  try {
    const { assignmentId, teacherId, courseId, semester } = req.body;

    // Vérifier si le cours existe
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Cours non trouvé'
      });
    }

    const newAssignment = await CourseAssignment.create({
      assignmentId,
      teacherId,
      courseId,
      semester
    });

    res.status(201).json({
      status: 'success',
      message: 'Enseignant assigné au cours avec succès',
      data: { assignment: newAssignment }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Cet enseignant est déjà assigné à ce cours pour ce semestre'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de l\'assignation',
      error: error.message
    });
  }
};

exports.getCoursesByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    const assignments = await CourseAssignment.find({ teacherId });

    // Récupérer les détails des cours
    const courseIds = assignments.map(a => a.courseId);
    const courses = await Course.find({ courseId: { $in: courseIds } });

    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: { courses }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des cours de l\'enseignant',
      error: error.message
    });
  }
};

// ✅ AJOUTER: Mettre à jour un enrollment (pour les notes)
exports.updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOneAndUpdate(
      { enrollmentId: req.params.enrollmentId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!enrollment) {
      return res.status(404).json({
        status: 'error',
        message: 'Inscription non trouvée'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Inscription mise à jour avec succès',
      data: { enrollment }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la mise à jour de l\'inscription',
      error: error.message
    });
  }
};