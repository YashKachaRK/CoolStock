const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginStaff = (req, res) => {
  const { email, role, password } = req.body;

  // 1. Determine which table to check based on role
  const table = role === 'Customer' ? 'customers' : 'staff';
  const sql = `SELECT * FROM ${table} WHERE email = ?`;

  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "Server error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ msg: "User Not Found" });
    }

    const user = result[0];

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // 3. Check Role (only for staff, customers are always 'Customer')
    if (table === 'staff' && user.role !== role) {
      return res.status(403).json({ msg: "Role mismatch. Please select the correct role." });
    }

    // 4. Generate Token
    // Use shop name for customers if present, else user name
    const displayName = table === 'customers' ? (user.shop || user.name) : user.name;
    const userRole = table === 'customers' ? 'Customer' : user.role;

    const payload = {
      id: user.id,
      email: user.email,
      role: userRole,
      name: displayName
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "8h" });

    res.json({
      msg: "Login Successful",
      token,
      user: payload
    });
  });
};