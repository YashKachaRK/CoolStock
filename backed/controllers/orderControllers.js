const db = require("../config/db");

// Place a new order
exports.placeOrder = (req, res) => {
    const { customer_id, order_number, amount, urgency, items } = req.body;
    const date = new Date().toISOString().split("T")[0];

    const sqlOrder = `INSERT INTO orders (customer_id, order_number, amount, urgency, date, status) 
                    VALUES (?, ?, ?, ?, ?, 'Pending')`;

    db.query(sqlOrder, [customer_id, order_number, amount, urgency, date], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error placing order");
        }

        const orderId = result.insertId;
        if (items && items.length > 0) {
            const sqlItems = "INSERT INTO order_items (order_id, product_id, quantity, price_per_unit) VALUES ?";
            const itemValues = items.map(item => [orderId, item.product_id, item.quantity, item.price_per_unit]);

            db.query(sqlItems, [itemValues], (errItems) => {
                if (errItems) {
                    console.error(errItems);
                    return res.status(500).send("Error adding order items");
                }
                res.status(201).json({ message: "Order placed successfully", orderId });
            });
        } else {
            res.status(201).json({ message: "Order placed successfully", orderId });
        }
    });
};

// Get all orders
exports.getAllOrders = (req, res) => {
    const sql = `
    SELECT o.*, c.shop as customer_name, c.addr as customer_addr, c.phone as customer_phone, s.name as delivery_boy_name,
           GROUP_CONCAT(CONCAT(p.name, ' x ', oi.quantity) SEPARATOR ', ') as items_summary
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    LEFT JOIN staff s ON o.delivery_boy_id = s.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    GROUP BY o.id
    ORDER BY o.date DESC, o.id DESC
  `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching orders");
        }
        res.json(result);
    });
};

const { sendEmail, templates } = require("../utils/emailService");

// Update order status
exports.updateOrderStatus = (req, res) => {
    const { id } = req.params;
    const { status, delivery_boy_id } = req.body;

    let sqlUpdate = "UPDATE orders SET status=?";
    let params = [status];

    if (delivery_boy_id) {
        sqlUpdate += ", delivery_boy_id=?";
        params.push(delivery_boy_id);
    }

    sqlUpdate += " WHERE id=?";
    params.push(id);

    db.query(sqlUpdate, params, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error updating order status");
        }

        // Fetch customer email and order info for notification
        const sqlInfo = `
            SELECT o.order_number, c.email, c.name 
            FROM orders o 
            JOIN customers c ON o.customer_id = c.id 
            WHERE o.id = ?
        `;
        db.query(sqlInfo, [id], async (infoErr, infoResult) => {
            if (!infoErr && infoResult.length > 0) {
                const { order_number, email, name } = infoResult[0];
                if (email) {
                    try {
                        let emailContent;
                        if (status === 'Cancelled') {
                            emailContent = templates.orderCancelled(order_number);
                        } else {
                            emailContent = templates.orderStatusUpdate(order_number, status);
                        }
                        await sendEmail(email, emailContent.subject, emailContent.html);
                    } catch (e) {
                        console.error("Failed to send order status email", e);
                    }
                }
            }
        });

        res.send("Order status updated");
    });
};

// Get order details
exports.getOrderDetails = (req, res) => {
    const { id } = req.params;
    const sqlOrder = `
    SELECT o.*, c.shop as customer_name, c.addr as customer_addr, c.phone as customer_phone
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE o.id = ?
  `;

    db.query(sqlOrder, [id], (err, orderResult) => {
        if (err) return res.status(500).send(err);
        if (orderResult.length === 0) return res.status(404).send("Order not found");

        const sqlItems = `
      SELECT oi.*, p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;

        db.query(sqlItems, [id], (errItems, itemsResult) => {
            if (errItems) return res.status(500).send(errItems);
            res.json({
                ...orderResult[0],
                items: itemsResult
            });
        });
    });
};

// Get orders for current customer
exports.getMyOrders = (req, res) => {
    const customerId = req.user.id; // From authMiddleware
    const sql = `
    SELECT o.*, c.shop as customer_name, c.addr as customer_addr 
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE o.customer_id = ?
    ORDER BY o.date DESC, o.id DESC
  `;
    db.query(sql, [customerId], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};

// Get assigned orders for delivery boy
exports.getAssignedOrders = (req, res) => {
    const deliveryBoyId = req.user.id;
    const sql = `
        SELECT o.*, c.shop as customer_name, c.addr as customer_addr, c.phone as customer_phone,
               GROUP_CONCAT(CONCAT(p.name, ' x ', oi.quantity) SEPARATOR ', ') as items_summary
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.delivery_boy_id = ? AND o.status IN ('Assigned', 'In Transit')
        GROUP BY o.id
        ORDER BY o.date DESC
    `;
    db.query(sql, [deliveryBoyId], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};

// Get delivery history for delivery boy
exports.getDeliveryHistory = (req, res) => {
    const deliveryBoyId = req.user.id;
    const sql = `
        SELECT o.*, c.shop as customer_name, c.addr as customer_addr,
               GROUP_CONCAT(CONCAT(p.name, ' x ', oi.quantity) SEPARATOR ', ') as items_summary
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.delivery_boy_id = ? AND o.status IN ('Delivered', 'Cash Deposited', 'Paid')
        GROUP BY o.id
        ORDER BY o.date DESC
    `;
    db.query(sql, [deliveryBoyId], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};
