const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const courseRoutes = require('./routes/courseRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/courses', courseRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Course Service is running!'
  });
});

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/course_db')
  .then(() => console.log('✅ Connecté à MongoDB - Course Service'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`🚀 Course Service démarré sur le port ${PORT}`);
});

module.exports = app;