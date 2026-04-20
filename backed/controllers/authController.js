const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.loginStaff = (req, res) => {
  const { email, role, password } = req.body;

  const sql = "SELECT * FROM staff WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "Server error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ msg: "User Not Found" });
    }

    const user = result[0];

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Check Role (Matches dropdown value from Frontend)
    if (user.role !== role) {
      return res.status(403).json({ msg: "Role mismatch. Please select the correct role." });
    }

    console.log(`User ${user.email} logged in as ${user.role}`);

    res.json({
      msg: "Login Successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
    });
  });
};