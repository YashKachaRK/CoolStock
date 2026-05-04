const mongoose = require('mongoose');

// Matches MySQL job_applications table
const applicationSchema = new mongoose.Schema({
  full_name:   { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, required: true },
  role:        { type: String, required: true },
  description: { type: String, default: '' },
  status:      { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  applied_at:  { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
