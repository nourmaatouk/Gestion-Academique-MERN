const axios = require('axios');

const authApi = axios.create({
  baseURL: process.env.AUTH_SERVICE_URL || 'http://localhost:3001/api/auth',
  timeout: 10000
});

// Méthode pour créer un user dans Auth-Service
exports.createUserInAuth = async (userData) => {
  try {
    const response = await authApi.post('/register', userData);
    return response.data;
  } catch (error) {
    // Si l'Auth-Service retourne une erreur, on la propage
    if (error.response) {
      throw new Error(error.response.data.message || 'Erreur Auth-Service');
    }
    throw new Error('Service d\'authentification indisponible');
  }
};

// Méthode pour vérifier un token
exports.verifyToken = async (token) => {
  try {
    const response = await authApi.get('/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error('Token invalide ou service indisponible');
  }
};