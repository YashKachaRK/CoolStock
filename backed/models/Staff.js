const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, required: true, enum: ['Admin', 'Manager', 'Cashier', 'Delivery'], default: 'Delivery' },
  phone:    { type: String, default: '' },
  username: { type: String, default: '' },
  status:   { type: String, default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
