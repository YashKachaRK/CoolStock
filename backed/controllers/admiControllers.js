const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.addStaff = async (req, res) => {
  const {
    name,
    role,
    username,
    email,
    phone,
    password,
    joined,
    status,
  } = req.body;

  try {
    // ✅ Convert date to YYYY-MM-DD
    const formattedDate = new Date(joined).toISOString().split("T")[0];

    // ✅ Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO staff 
      (name, role, username, email, phone, password, joined, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      sql,
      [name, role, username, email, phone, hashPassword, formattedDate, status],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error while inserting data");
        }
        res.send("Staff Added Successfully");
      }
    );

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

exports.staff = (req, res) => {
  const sql = "SELECT * FROM staff";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};