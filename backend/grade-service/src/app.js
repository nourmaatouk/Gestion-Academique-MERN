const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const gradeRoutes = require('./routes/gradeRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/grades', gradeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Grade Service running' });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grade_db')
  .then(() => console.log('✅ Grade Service MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`🚀 Grade Service on port ${PORT}`);
});