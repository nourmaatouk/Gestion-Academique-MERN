const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // 

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

   
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer nouvel utilisateur
    const newUser = await User.create({
      email,
      password: hashedPassword, 
      role,
      firstName,
      lastName
    });

    // Générer token JWT
    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      status: 'success',
      message: 'Utilisateur créé avec succès',
      data: {
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        },
        token
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'email et le mot de passe existent
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email et mot de passe requis'
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Email ou mot de passe incorrect'
      });
    }

  
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer token JWT
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      status: 'success',
      message: 'Connexion réussie',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur de vérification du token'
    });
  }
};