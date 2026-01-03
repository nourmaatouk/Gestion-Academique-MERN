const jwt = require('jsonwebtoken');


exports.protect = async (req, res, next) => {
  try {
    let token;

    // Vérifier si le token est dans le header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Vous n\'êtes pas connecté. Veuillez vous connecter pour accéder à cette ressource.'
      });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    // On fait confiance au JWT pour ce microservice
    req.user = {
      id: decoded.id,
      role: decoded.role
      
      // Les autres services pourront les récupérer via User-Service
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token invalide ou expiré'
    });
  }
};

// Middleware pour restreindre l'accès par rôle
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Vous n\'avez pas la permission d\'effectuer cette action'
      });
    }
    next();
  };
};