const Staff = require("../models/Staff");
const Customer = require("../models/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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