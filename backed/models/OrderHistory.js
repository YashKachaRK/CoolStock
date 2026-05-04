const mongoose = require('mongoose');

// Matches MySQL order_history table exactly:
// id, order_id, action, performed_by, performed_at, remarks
const orderHistorySchema = new mongoose.Schema({
  order_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  // Actions matching Spring Boot: Ordered, Assigned, In Transit, Deposited, Paid, Cancelled
  action:       { type: String, required: true },
  performed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
  performed_at: { type: Date, default: Date.now },
  remarks:      { type: String, default: '' },
});

module.exports = mongoose.model('OrderHistory', orderHistorySchema);
