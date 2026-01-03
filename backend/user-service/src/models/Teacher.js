const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacherId: {
    type: String,
    required: true,
    unique: true
  },
  specialite: {
    type: String,
    required: true
  },
  department: {
    type: String,
    default: 'Informatique'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);