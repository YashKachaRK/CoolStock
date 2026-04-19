const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginStaff = (req, res) => {
  const { email, role, password } = req.body;

  // Select target table based on role
  // If role is 'Customer', check the customers table. Otherwise, check the staff table.
  const table = role === 'Customer' ? 'customers' : 'staff';
  const sql = `SELECT * FROM ${table} WHERE email = ?`;

  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "Server error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ msg: `${role} Not Found` });
    }

    const user = result[0];

    // Check Password
    if (!user.password) {
      return res.status(400).json({ msg: "Account not properly configured. Please contact admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Check Role if checking staff table
    if (table === 'staff' && user.role !== role) {
      return res.status(403).json({ msg: "Role mismatch. Please select the correct role." });
    }

    // Generate Token
    // We explicitly set role to 'Customer' for customer table logins
    const userRole = table === 'customers' ? 'Customer' : user.role;
    const payload = { id: user.id, email: user.email, role: userRole, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "8h" });

    console.log(`User ${user.email} logged in as ${userRole}`);

    res.json({
      msg: "Login Successful",
      token,
      user: payload,
    });
  });
};