const Order = require("../models/Order");
const OrderHistory = require("../models/OrderHistory");
const Customer = require("../models/Customer");
const Staff = require("../models/Staff");
const Product = require("../models/Product");
const emailService = require("../utils/emailService");
const { checkLowStockAndNotify } = require("./productController");

// ── Helper: save to standalone OrderHistory collection (mirrors MySQL) ──
const saveHistory = async (order_id, action, performed_by, remarks) => {
    try {
        await OrderHistory.create({ order_id, action, performed_by: performed_by || null, performed_at: new Date(), remarks });
    } catch (e) {
        console.error("OrderHistory save failed:", e.message);
    }
};

// ── Helper: format order for frontend ────────────────────────────────────
const formatOrder = (o) => {
    const obj = typeof o.toObject === 'function' ? o.toObject() : o;
    const out = { ...obj, id: obj._id };

    if (obj.customer_id) {
        out.customer_name  = obj.customer_id.shop || obj.customer_id.name;
        out.customer_addr  = obj.customer_id.addr;
        out.customer_phone = obj.customer_id.phone;
    }
    if (obj.assigned_to)          out.delivery_boy_name        = obj.assigned_to.name;
    if (obj.assigned_by)          out.assigned_by_name         = obj.assigned_by.name;
    if (obj.payment_collected_by) out.payment_collected_by_name = obj.payment_collected_by.name;
    if (obj.payment_verified_by)  out.payment_verified_by_name  = obj.payment_verified_by.name;

    out.items_summary = obj.items && obj.items.length > 0
        ? obj.items.map(item => {
            const n = item.product_id && item.product_id.name ? item.product_id.name : 'Unknown';
            return `${n} x ${item.quantity}`;
          }).join(', ')
        : '';

    return out;
};

// ── Helper: populate chain ────────────────────────────────────────────────
const populateOrder = (query) => query
    .populate('customer_id', 'shop addr phone name')
    .populate('assigned_to', 'name role')
    .populate('assigned_by', 'name role')
    .populate('payment_collected_by', 'name role')
    .populate('payment_verified_by', 'name role')
    .populate('items.product_id', 'name');

// ════════════════════════════════════════════════════════════════════════════
// 1. CUSTOMER: Place a new order   →  status: "Ordered"
// ════════════════════════════════════════════════════════════════════════════
exports.placeOrder = async (req, res) => {
    try {
        const { customer_id, order_number, amount, urgency, items } = req.body;

        // Calculate subtotal per item (matching MySQL order_items.subtotal column)
        const itemsWithSubtotal = (items || []).map(item => ({
            ...item,
            subtotal: item.quantity * item.price_per_unit,
        }));

        const firstEntry = {
            action: 'Ordered',
            performed_by: null,
            performed_by_name: 'Customer',
            performed_at: new Date(),
            remarks: 'Order placed by customer',
        };

        const newOrder = new Order({
            customer_id, order_number, amount, urgency,
            items: itemsWithSubtotal,
            status: 'Ordered',
            order_history: [firstEntry],
        });
        await newOrder.save();

        // ── Deduct Stock & Check Low Stock ──
        for (const item of itemsWithSubtotal) {
            const p = await Product.findById(item.product_id);
            if (p) {
                p.stock -= item.quantity;
                await p.save();
                // Trigger one-time low stock alert if needed
                await checkLowStockAndNotify(p);
            }
        }

        // Also save to standalone OrderHistory collection (mirrors MySQL table)
        await saveHistory(newOrder._id, 'Ordered', null, 'Order placed by customer');

        // ── Trigger Email: Order Confirmation ──
        const customer = await Customer.findById(customer_id);
        if (customer && customer.email) {
            emailService.sendOrderConfirmation(customer, newOrder);
        }

        res.status(201).json({ message: "Order placed successfully", orderId: newOrder._id });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error placing order: " + err.message);
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 2. MANAGER: Assign order to delivery boy   →  status: "Assigned"
// ════════════════════════════════════════════════════════════════════════════
exports.assignOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { delivery_boy_id, manager_id, manager_name } = req.body;

        const deliveryBoy = await Staff.findById(delivery_boy_id).select('name role');
        if (!deliveryBoy || deliveryBoy.role !== 'Delivery') {
            return res.status(400).json({ msg: "Selected staff is not a Delivery boy" });
        }

        const historyEntry = {
            action: 'Assigned',
            performed_by: manager_id,
            performed_by_name: manager_name || 'Manager',
            performed_at: new Date(),
            remarks: `Assigned to ${deliveryBoy.name}`,
        };

        await Order.findByIdAndUpdate(id, {
            status: 'Assigned',
            assigned_to: delivery_boy_id,
            assigned_by: manager_id,
            assigned_at: new Date(),
            $push: { order_history: historyEntry },
        });

        await saveHistory(id, 'Assigned', manager_id, `Assigned to ${deliveryBoy.name}`);

        // ── Trigger Emails: Assignment Notifications ──
        const fullOrder = await populateOrder(Order.findById(id));
        if (deliveryBoy && deliveryBoy.email) {
            emailService.sendAssignmentNotification(deliveryBoy, fullOrder);
        }
        if (fullOrder && fullOrder.customer_id && fullOrder.customer_id.email) {
            emailService.sendOrderStatusUpdate(fullOrder.customer_id, fullOrder, 'Assigned');
        }

        res.json({ message: "Order assigned to " + deliveryBoy.name });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error assigning order");
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 3. DELIVERY: Mark as "In Transit" (picked up)
// ════════════════════════════════════════════════════════════════════════════
exports.dispatchOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { delivery_boy_id, delivery_boy_name } = req.body;

        const historyEntry = {
            action: 'In Transit',
            performed_by: delivery_boy_id,
            performed_by_name: delivery_boy_name || 'Delivery Boy',
            performed_at: new Date(),
            remarks: 'Status updated to In Transit',
        };

        await Order.findByIdAndUpdate(id, {
            status: 'In Transit',
            in_transit_at: new Date(),
            $push: { order_history: historyEntry },
        });

        await saveHistory(id, 'In Transit', delivery_boy_id, 'Status updated to In Transit');

        // ── Trigger Email: Status Update ──
        const fullOrder = await populateOrder(Order.findById(id));
        if (fullOrder && fullOrder.customer_id && fullOrder.customer_id.email) {
            emailService.sendOrderStatusUpdate(fullOrder.customer_id, fullOrder, 'In Transit');
        }

        res.json({ message: "Order is now In Transit" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating order to In Transit");
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 4. DELIVERY: Cash deposited to cashier   →  status: "Deposited"
// ════════════════════════════════════════════════════════════════════════════
exports.markDelivered = async (req, res) => {
    try {
        const { id } = req.params;
        const { delivery_boy_id, delivery_boy_name, cashier_id } = req.body;

        const historyEntry = {
            action: 'Deposited',
            performed_by: delivery_boy_id,
            performed_by_name: delivery_boy_name || 'Delivery Boy',
            performed_at: new Date(),
            remarks: cashier_id ? `Cash deposited to cashier (ID: ${cashier_id})` : 'Cash deposited to cashier',
        };

        await Order.findByIdAndUpdate(id, {
            status: 'Deposited',
            deposited_at: new Date(),
            payment_collected_by: delivery_boy_id,
            $push: { order_history: historyEntry },
        });

        await saveHistory(id, 'Deposited', delivery_boy_id, historyEntry.remarks);

        // ── Trigger Email: Status Update ──
        const fullOrder = await populateOrder(Order.findById(id));
        if (fullOrder && fullOrder.customer_id && fullOrder.customer_id.email) {
            emailService.sendOrderStatusUpdate(fullOrder.customer_id, fullOrder, 'Deposited');
        }

        res.json({ message: "Cash deposited. Waiting for cashier verification." });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error marking order as Deposited");
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 5. CASHIER: Verify payment → status: "Paid"
// ════════════════════════════════════════════════════════════════════════════
exports.verifyPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { cashier_id, cashier_name } = req.body;

        const historyEntry = {
            action: 'Paid',
            performed_by: cashier_id,
            performed_by_name: cashier_name || 'Cashier',
            performed_at: new Date(),
            remarks: 'Payment verified and order finalized',
        };

        await Order.findByIdAndUpdate(id, {
            status: 'Paid',
            paid_at: new Date(),
            payment_verified_by: cashier_id,
            $push: { order_history: historyEntry },
        });

        await saveHistory(id, 'Paid', cashier_id, 'Payment verified and order finalized');

        // ── Trigger Email: Payment Verification ──
        const fullOrder = await populateOrder(Order.findById(id));
        if (fullOrder && fullOrder.customer_id && fullOrder.customer_id.email) {
            emailService.sendPaymentVerification(fullOrder.customer_id, fullOrder);
        }

        res.json({ message: "Payment verified. Order is now Paid." });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error verifying payment");
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 6. ADMIN/MANAGER: All orders
// ════════════════════════════════════════════════════════════════════════════
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await populateOrder(Order.find()).sort({ date: -1 });
        res.json(orders.map(formatOrder));
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching orders");
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 7. ADMIN/MANAGER: Full audit log from standalone OrderHistory collection
// ════════════════════════════════════════════════════════════════════════════
exports.getAuditLog = async (req, res) => {
    try {
        const history = await OrderHistory.find()
            .populate('order_id', 'order_number amount')
            .populate('performed_by', 'name role')
            .sort({ performed_at: -1 });

        const log = history.map(h => ({
            id: h._id,
            order_number: h.order_id ? h.order_id.order_number : 'N/A',
            order_amount: h.order_id ? h.order_id.amount : 0,
            action: h.action,
            performed_by: h.performed_by ? h.performed_by.name : 'Customer',
            role: h.performed_by ? h.performed_by.role : 'Customer',
            performed_at: h.performed_at,
            remarks: h.remarks,
        }));

        res.json(log);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching audit log");
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 8. Get order history for a specific order (embedded)
// ════════════════════════════════════════════════════════════════════════════
exports.getOrderHistory = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).select('order_history order_number');
        if (!order) return res.status(404).send("Order not found");
        res.json({ order_number: order.order_number, history: order.order_history });
    } catch (err) {
        res.status(500).send("Error fetching order history");
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 9. Single order detail
// ════════════════════════════════════════════════════════════════════════════
exports.getOrderDetails = async (req, res) => {
    try {
        const order = await populateOrder(Order.findById(req.params.id));
        if (!order) return res.status(404).send("Order not found");
        const formatted = formatOrder(order);
        formatted.items = formatted.items.map(item => ({
            ...item,
            product_name: item.product_id ? item.product_id.name : 'Unknown'
        }));
        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching order details");
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 10. CUSTOMER: My orders
// ════════════════════════════════════════════════════════════════════════════
exports.getMyOrders = async (req, res) => {
    try {
        const customerId = req.user ? req.user.id : req.query.customer_id;
        const orders = await populateOrder(Order.find({ customer_id: customerId })).sort({ date: -1 });
        res.json(orders.map(formatOrder));
    } catch (err) {
        res.status(500).send("Error fetching my orders");
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 11. DELIVERY: My assigned orders
// ════════════════════════════════════════════════════════════════════════════
exports.getAssignedOrders = async (req, res) => {
    try {
        const deliveryBoyId = req.user ? req.user.id : req.query.delivery_boy_id;
        const orders = await populateOrder(
            Order.find({ assigned_to: deliveryBoyId, status: { $in: ['Assigned', 'In Transit'] } })
        ).sort({ date: -1 });
        res.json(orders.map(formatOrder));
    } catch (err) {
        res.status(500).send("Error fetching assigned orders");
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 12. DELIVERY: My delivery history
// ════════════════════════════════════════════════════════════════════════════
exports.getDeliveryHistory = async (req, res) => {
    try {
        const deliveryBoyId = req.user ? req.user.id : req.query.delivery_boy_id;
        const orders = await populateOrder(
            Order.find({ assigned_to: deliveryBoyId, status: { $in: ['Deposited', 'Paid'] } })
        ).sort({ date: -1 });
        res.json(orders.map(formatOrder));
    } catch (err) {
        res.status(500).send("Error fetching delivery history");
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 13. CASHIER: Orders pending payment verification (Deposited)
// ════════════════════════════════════════════════════════════════════════════
exports.getPendingPayments = async (req, res) => {
    try {
        const orders = await populateOrder(Order.find({ status: 'Deposited' })).sort({ deposited_at: 1 });
        res.json(orders.map(formatOrder));
    } catch (err) {
        res.status(500).send("Error fetching pending payments");
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 14. MANAGER: Unassigned orders
// ════════════════════════════════════════════════════════════════════════════
exports.getPendingOrders = async (req, res) => {
    try {
        const orders = await populateOrder(Order.find({ status: 'Ordered' })).sort({ date: 1 });
        res.json(orders.map(formatOrder));
    } catch (err) {
        res.status(500).send("Error fetching pending orders");
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 15. Get delivery boys (for manager assign dropdown)
// ════════════════════════════════════════════════════════════════════════════
exports.getDeliveryBoys = async (req, res) => {
    try {
        const boys = await Staff.find({ role: 'Delivery', status: 'Active' }).select('name email phone');
        res.json(boys.map(b => ({ ...b.toObject(), id: b._id })));
    } catch (err) {
        res.status(500).send("Error fetching delivery boys");
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 16. Cancel order
// ════════════════════════════════════════════════════════════════════════════
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { cancelled_by, remarks } = req.body;

        const historyEntry = {
            action: 'Cancelled',
            performed_by: cancelled_by || null,
            performed_by_name: 'Unknown',
            performed_at: new Date(),
            remarks: remarks || 'Order cancelled',
        };

        await Order.findByIdAndUpdate(id, {
            status: 'Cancelled',
            $push: { order_history: historyEntry },
        });

        await saveHistory(id, 'Cancelled', cancelled_by, remarks || 'Order cancelled');

        // ── Trigger Email: Cancellation ──
        const fullOrder = await populateOrder(Order.findById(id));
        if (fullOrder && fullOrder.customer_id && fullOrder.customer_id.email) {
            emailService.sendOrderCancellation(fullOrder.customer_id, fullOrder, remarks);
        }

        res.json({ message: "Order cancelled" });
    } catch (err) {
        res.status(500).send("Error cancelling order");
    }
};

// ════════════════════════════════════════════════════════════════════════════
// 17. Generic status update (admin override)
// ════════════════════════════════════════════════════════════════════════════
exports.updateOrderStatus = async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
        res.json({ message: "Status updated" });
    } catch (err) {
        res.status(500).send("Error updating status");
    }
};
