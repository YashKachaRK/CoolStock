const db = require("../config/db");
const bcrypt = require("bcrypt");
const { sendEmail, templates } = require("../utils/emailService");

// Helper for Promise-based queries
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// Get all customers (Admin only)
exports.getAllCustomers = async (req, res) => {
    const sql = `
        SELECT c.*, 
               COUNT(o.id) as orders, 
               COALESCE(SUM(o.amount), 0) as totalSpent 
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        GROUP BY c.id
        ORDER BY c.joined DESC
    `;
    try {
        const result = await query(sql, []);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching customers");
    }
};

// Get profile for logged-in customer
exports.getCustomerProfile = async (req, res) => {
    const customerId = req.user.id;
    try {
        const result = await query("SELECT id, name, shop, addr, phone, email, status, joined FROM customers WHERE id = ?", [customerId]);
        if (result.length === 0) return res.status(404).send("Profile not found");
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// Update profile for logged-in customer
exports.updateCustomerProfile = async (req, res) => {
    const customerId = req.user.id;
    const { name, shop, addr, phone } = req.body;
    try {
        await query("UPDATE customers SET name=?, shop=?, addr=?, phone=? WHERE id=?", [name, shop, addr, phone, customerId]);
        res.send("Profile updated successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating profile");
    }
};

// Add new customer
exports.addCustomer = async (req, res) => {
    const { name, shop, addr, phone, email, status } = req.body;
    const joined = new Date().toISOString().split("T")[0];

    // 1. Generate Credentials
    const tempPassword = Math.random().toString(36).slice(-8);
    const username = (shop || name).toLowerCase().replace(/\s+/g, '_') + Math.floor(1000 + Math.random() * 9000);

    console.log(`🆕 Adding Customer: ${email} | Temp Password: ${tempPassword}`);

    try {
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // 2. Insert into Customers table
        const sqlCustomer = `INSERT INTO customers (name, shop, addr, phone, email, password, status, joined) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        await query(sqlCustomer, [name, shop, addr, phone, email, hashedPassword, status || 'Active', joined]);

        // 3. Send Credentials Email
        try {
            const { subject, html } = templates.staffCredentials(name, username, tempPassword);
            await sendEmail(email, subject, html);
            console.log(`📧 Credentials sent successfully to customer: ${email}`);
        } catch (e) {
            console.error("❌ Customer Welcome Email Failed:", e.message);
        }

        res.send("Customer added successfully with portal access");
    } catch (e) {
        console.error("❌ Add Customer Error:", e);
        res.status(500).send(e.code === 'ER_DUP_ENTRY' ? "Email already exists" : "Server Error");
    }
};

exports.updateCustomerStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await query("UPDATE customers SET status=? WHERE id=?", [status, id]);
        res.send("Status updated");
    } catch (err) {
        res.status(500).send("Error updating customer status");
    }
};

exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        await query("DELETE FROM customers WHERE id=?", [id]);
        res.send("Customer deleted");
    } catch (err) {
        res.status(500).send("Error deleting customer");
    }
};
