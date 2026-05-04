const Customer = require("../models/Customer");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const { sendEmail, templates } = require("../utils/emailService");

// Get all customers (Admin only)
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'customer_id',
                    as: 'customerOrders'
                }
            },
            {
                $addFields: {
                    orders: { $size: "$customerOrders" },
                    totalSpent: { $sum: "$customerOrders.amount" }
                }
            },
            {
                $project: {
                    customerOrders: 0,
                    password: 0
                }
            },
            {
                $sort: { joined: -1 }
            }
        ]);
        
        // Map _id to id for frontend
        res.json(customers.map(c => ({ ...c, id: c._id })));
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching customers");
    }
};

// Get profile for logged-in customer
exports.getCustomerProfile = async (req, res) => {
    try {
        const customerId = req.user.id;
        const customer = await Customer.findById(customerId).select('-password');
        if (!customer) return res.status(404).send("Profile not found");
        res.json({ ...customer.toObject(), id: customer._id });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// Update profile for logged-in customer
exports.updateCustomerProfile = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { name, shop, addr, phone } = req.body;
        await Customer.findByIdAndUpdate(customerId, { name, shop, addr, phone });
        res.send("Profile updated successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating profile");
    }
};

// Add new customer
exports.addCustomer = async (req, res) => {
    try {
        const { name, shop, addr, phone, email, status } = req.body;

        // Check if customer exists
        const existing = await Customer.findOne({ email });
        if (existing) return res.status(400).send("Email already exists");

        // Generate Credentials
        const tempPassword = Math.random().toString(36).slice(-8);
        const username = (shop || name).toLowerCase().replace(/\s+/g, '_') + Math.floor(1000 + Math.random() * 9000);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const newCustomer = new Customer({
            name, shop, addr, phone, email, password: hashedPassword, status: status || 'Active'
        });

        await newCustomer.save();

        // Send Credentials Email
        try {
            const { subject, html } = templates.staffCredentials(name, username, tempPassword);
            await sendEmail(email, subject, html);
        } catch (e) {
            console.error("❌ Customer Welcome Email Failed:", e.message);
        }

        res.send("Customer added successfully with portal access");
    } catch (e) {
        console.error("❌ Add Customer Error:", e);
        res.status(500).send("Server Error");
    }
};

exports.updateCustomerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await Customer.findByIdAndUpdate(id, { status });
        res.send("Status updated");
    } catch (err) {
        res.status(500).send("Error updating customer status");
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        await Customer.findByIdAndDelete(id);
        res.send("Customer deleted");
    } catch (err) {
        res.status(500).send("Error deleting customer");
    }
};
