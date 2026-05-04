const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shop: { type: String, required: true },
  addr: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, default: 'Active' },
  joined: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
