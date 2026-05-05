const Staff = require("../models/Staff");
const Customer = require("../models/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const ProductBatch = require("../models/ProductBatch");
const emailService = require("../utils/emailService");

exports.loginStaff = async (req, res) => {
  try {
    const { email, role, password } = req.body;

    let user;
    if (role === 'Customer') {
      user = await Customer.findOne({ email });
    } else {
      user = await Staff.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ msg: "User Not Found" });
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Check Role
    if (role !== 'Customer' && user.role !== role) {
      return res.status(403).json({ msg: "Role mismatch. Please select the correct role." });
    }

    // Generate Token
    const displayName = role === 'Customer' ? (user.shop || user.name) : user.name;
    const userRole = role === 'Customer' ? 'Customer' : user.role;

    const payload = {
      id: user._id,
      email: user.email,
      role: userRole,
      name: role === 'Customer' ? user.name : user.name,
      shop: role === 'Customer' ? (user.shop || '') : undefined,
      addr: role === 'Customer' ? (user.addr || '') : undefined,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "8h" });

    // ── Trigger Alerts on Login (Managers/Admins) ──
    if (userRole === 'Manager' || userRole === 'Admin') {
        (async () => {
            try {
                // 1. Check Low Stock
                const lowStockProds = await Product.find({ 
                    $expr: { $lte: ["$stock", "$lowThreshold"] } 
                });
                for (const p of lowStockProds) {
                    await emailService.sendLowStockAlert(user.email, p);
                }

                // 2. Check Expiry (within next 7 days)
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                const expiringBatches = await ProductBatch.find({
                    expiry_date: { $lte: nextWeek, $gte: new Date() },
                    alert_sent: { $ne: true }
                }).populate('product_id');

                for (const b of expiringBatches) {
                    if (b.product_id) {
                        await emailService.sendExpiryAlert(user.email, b.product_id, b);
                        b.alert_sent = true;
                        await b.save();
                    }
                }
            } catch (err) {
                console.error("Alert trigger failed:", err.message);
            }
        })();
    }

    res.json({
      msg: "Login Successful",
      token,
      user: payload
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email, role } = req.body;
        let user;
        if (role === 'Customer') {
            user = await Customer.findOne({ email });
        } else {
            user = await Staff.findOne({ email });
        }

        if (!user) return res.status(404).json({ msg: "User not found" });

        // Generate 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // In a real app, you'd save this to DB with expiry
        // For now, we'll just send it. 
        // We'll also use a simple temporary "password" update for demo purposes if reset is needed immediately
        
        await emailService.sendPasswordReset(user, resetCode);
        
        res.json({ msg: "Reset code sent to your email", code: resetCode }); // Sending code in response for demo/testing convenience
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, role, newPassword } = req.body;
        let user;
        if (role === 'Customer') {
            user = await Customer.findOne({ email });
        } else {
            user = await Staff.findOne({ email });
        }

        if (!user) return res.status(404).json({ msg: "User not found" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ msg: "Password reset successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};