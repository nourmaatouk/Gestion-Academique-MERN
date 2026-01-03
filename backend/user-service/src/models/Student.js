const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  dateNaissance: {
    type: Date,
    required: true
  },
  filiere: {
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

module.exports = mongoose.model('Student', studentSchema);