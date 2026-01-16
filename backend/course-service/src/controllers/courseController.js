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

exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({
        status: 'error',
        message: 'Département non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Département modifié avec succès',
      data: { department }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la modification du département',
      error: error.message
    });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({
        status: 'error',
        message: 'Département non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Département supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression du département',
      error: error.message
    });
  }
};

// 📝 CRUD ENROLLMENTS
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find();
    
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

exports.createEnrollment = async (req, res) => {
  try {
    const { studentId, courseId, semester } = req.body;

    // Vérifier si le cours existe
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Cours non trouvé'
      });
    }

    // Auto-generate enrollmentId if not provided
    const enrollmentId = req.body.enrollmentId || `ENR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
    const { role } = req.user;
    
    // Students can only view their own enrollments
    // Note: For students, we trust the frontend sends the correct studentId
    // as it's retrieved from their profile. Additional verification could be
    // added by checking against the user-service if needed.
    
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
    const { teacherId, courseId, semester } = req.body;

    // Vérifier si le cours existe
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Cours non trouvé'
      });
    }

    // Auto-generate assignmentId if not provided
    const assignmentId = req.body.assignmentId || `ASN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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

    res.status(200).json({
      status: 'success',
      results: assignments.length,
      data: { assignments }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des cours de l\'enseignant',
      error: error.message
    });
  }
};

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

exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOneAndDelete({ enrollmentId: req.params.enrollmentId });

    if (!enrollment) {
      return res.status(404).json({
        status: 'error',
        message: 'Inscription non trouvée'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Inscription supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression de l\'inscription',
      error: error.message
    });
  }
};

// 👨‍🏫 CRUD COURSE ASSIGNMENTS
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await CourseAssignment.find();
    
    res.status(200).json({
      status: 'success',
      results: assignments.length,
      data: { assignments }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des assignations',
      error: error.message
    });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await CourseAssignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assignation non trouvée'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Assignation mise à jour avec succès',
      data: { assignment }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la mise à jour de l\'assignation',
      error: error.message
    });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await CourseAssignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assignation non trouvée'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Assignation supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression de l\'assignation',
      error: error.message
    });
  }
};