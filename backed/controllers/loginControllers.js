const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");

exports.loginStaff = async (req, res) => {
  try {
    const { email, role, password } = req.body;

    const user = await Staff.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    if (user.role !== role) {
      return res.status(403).json({ msg: "Role is mismatcg...." });
    }

    res.json({
      msg: "Login Succesfull",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
