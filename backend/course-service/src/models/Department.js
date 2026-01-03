const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  deptId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);