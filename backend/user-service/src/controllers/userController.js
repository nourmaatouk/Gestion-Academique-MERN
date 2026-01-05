const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { createUserInAuth } = require('../services/authApiClient');

// PROFILE ENDPOINTS
exports.getStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ userId });
    
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Profil étudiant non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

exports.getTeacherProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const teacher = await Teacher.findOne({ userId });
    
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Profil enseignant non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

// CRUD STUDENTS
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    
    res.status(200).json({
      status: 'success',
      results: students.length,
      data: { students }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des étudiants',
      error: error.message
    });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Étudiant non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { student }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération de l\'étudiant',
      error: error.message
    });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { email, password, firstName, lastName, studentId, dateNaissance, filiere, department } = req.body;

    // 1. Créer le User dans Auth-Service
    const authResult = await createUserInAuth({
      email,
      password,
      role: 'student',
      firstName,
      lastName
    });

    // 2. Créer le Student dans User-Service
    const newStudent = await Student.create({
      userId: authResult.data.user.id,
      studentId,
      dateNaissance,
      filiere,
      department,
      email,      
      firstName,    
      lastName    
    });

    res.status(201).json({
      status: 'success',
      message: 'Étudiant créé avec succès',
      data: { 
        student: newStudent,
        auth: {
          token: authResult.data.token,
          user: authResult.data.user
        }
      }
    });

  } catch (error) {
    if (error.message.includes('existe déjà')) {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la création de l\'étudiant',
      error: error.message
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Étudiant non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Étudiant modifié avec succès',
      data: { student }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la modification de l\'étudiant',
      error: error.message
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Étudiant non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Étudiant supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression de l\'étudiant',
      error: error.message
    });
  }
};

// CRUD TEACHERS
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    
    res.status(200).json({
      status: 'success',
      results: teachers.length,
      data: { teachers }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des enseignants',
      error: error.message
    });
  }
};

exports.getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Enseignant non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { teacher }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération de l\'enseignant',
      error: error.message
    });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const { email, password, firstName, lastName, teacherId, specialite, department } = req.body;

    // 1. Créer le User dans Auth-Service
    const authResult = await createUserInAuth({
      email,
      password,
      role: 'teacher',
      firstName,
      lastName
    });

    // 2. Créer le Teacher dans User-Service
    const newTeacher = await Teacher.create({
      userId: authResult.data.user.id,
      teacherId,
      specialite,
      department,
      email,
      firstName,
      lastName
    });

    res.status(201).json({
      status: 'success',
      message: 'Enseignant créé avec succès',
      data: { 
        teacher: newTeacher,
        auth: {
          token: authResult.data.token,
          user: authResult.data.user
        }
      }
    });

  } catch (error) {
    if (error.message.includes('existe déjà')) {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la création de l\'enseignant',
      error: error.message
    });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Enseignant non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Enseignant modifié avec succès',
      data: { teacher }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la modification de l\'enseignant',
      error: error.message
    });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Enseignant non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Enseignant supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression de l\'enseignant',
      error: error.message
    });
  }
};