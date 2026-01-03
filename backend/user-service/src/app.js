const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'User Service is running!'
  });
});

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/user_db')
  .then(() => console.log('✅ Connecté à MongoDB - User Service'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 User Service démarré sur le port ${PORT}`);
});

module.exports = app;