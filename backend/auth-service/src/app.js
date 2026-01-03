const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Auth Service is running!'
  });
});


// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_db')
  .then(() => console.log('✅ Connecté à MongoDB - Auth Service'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Auth Service démarré sur le port ${PORT}`);
});

module.exports = app;