const mongoose = require('mongoose');

// ── order_items (embedded — matches MySQL order_items columns) ───────────
const orderItemSchema = new mongoose.Schema({
  product_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:       { type: Number, required: true },
  price_per_unit: { type: Number, required: true },
  subtotal:       { type: Number, required: true },   // quantity × price_per_unit (matches MySQL)
});

const orderSchema = new mongoose.Schema({
  // ── Core (matches MySQL orders table) ─────────────────────────────
  customer_id:   { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  order_number:  { type: String, required: true, unique: true },
  amount:        { type: Number, required: true },
  urgency:       { type: String, required: true, enum: ['Normal', 'Urgent'], default: 'Normal' },

  // Status lifecycle matching MySQL order_history actions:
  //  Ordered → Assigned → In Transit → Deposited → Paid
  status: {
    type: String,
    enum: ['Ordered', 'Assigned', 'In Transit', 'Deposited', 'Paid', 'Cancelled'],
    default: 'Ordered'
  },

  // ── Role-based tracking ────────────────────────────────────────────
  assigned_to:           { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },  // Delivery boy
  assigned_by:           { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },  // Manager
  payment_collected_by:  { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },  // Delivery boy (Deposited)
  payment_verified_by:   { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },  // Cashier (Paid)

  // ── Stage timestamps ───────────────────────────────────────────────
  assigned_at:       { type: Date, default: null },
  in_transit_at:     { type: Date, default: null },   // renamed from dispatched_at → matches "In Transit"
  deposited_at:      { type: Date, default: null },   // renamed from cash_collected_at → matches "Deposited"
  paid_at:           { type: Date, default: null },

  // ── Embedded order items (mirrors MySQL order_items join table) ────
  items: [orderItemSchema],

  // ── Embedded audit log (mirrors MySQL order_history table) ─────────
  // Columns: order_id, action, performed_by, performed_at, remarks
  order_history: [{
    action:       { type: String, required: true },   // Ordered / Assigned / In Transit / Deposited / Paid
    performed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
    performed_by_name: { type: String, default: '' }, // denormalized for display
    performed_at: { type: Date, default: Date.now },
    remarks:      { type: String, default: '' },
  }],

  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

