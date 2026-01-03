const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  enrollmentId: {
    type: String,
    required: true,
    unique: true
  },
  studentId: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    min: 0,
    max: 20,
    default: null
  },
  semester: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['enrolled', 'completed', 'dropped'],
    default: 'enrolled'
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Empêcher les doublons studentId + courseId
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);