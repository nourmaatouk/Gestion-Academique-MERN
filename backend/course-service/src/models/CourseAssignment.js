const mongoose = require('mongoose');

const courseAssignmentSchema = new mongoose.Schema({
  assignmentId: {
    type: String,
    required: true,
    unique: true
  },
  teacherId: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Empêcher les doublons teacherId + courseId + semester
courseAssignmentSchema.index({ teacherId: 1, courseId: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('CourseAssignment', courseAssignmentSchema);