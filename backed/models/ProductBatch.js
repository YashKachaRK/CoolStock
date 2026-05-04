const mongoose = require('mongoose');

const productBatchSchema = new mongoose.Schema({
  product_id:         { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  batch_number:       { type: String, default: null },
  quantity:           { type: Number, required: true, default: 0 },
  expiry_date:        { type: Date, required: true },
  received_at:        { type: Date, default: Date.now },
  expiry_alert_sent:  { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('ProductBatch', productBatchSchema);
