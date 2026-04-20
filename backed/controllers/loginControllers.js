const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.loginStaff = (req, res) => {
  const { email, role, password } = req.body;

  const sql = "select * from staff where email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).send("Server error");

    if (result.length === 0) {
      return res.status(400).json({ msg: "User Not Found" });
    }
    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    if (user.role !== role) {
      return res.status(403).json({ msg: "Role is mismatcg...." })
    }
    // Done

    res.json({
      msg: "Login Succesfull",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  });
};
