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

exports.addStaff = async (req, res) => {
  const { name, role, username, email, phone, password, joined, status } = req.body;

  try {
    let formattedDate = joined;
    try {
      if (!joined || joined === "Invalid Date") {
        formattedDate = new Date().toISOString().split("T")[0];
      } else {
        formattedDate = new Date(joined).toISOString().split("T")[0];
      }
    } catch (e) {
      formattedDate = new Date().toISOString().split("T")[0];
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO staff 
          (name, role, username, email, phone, password, joined, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    await query(sql, [name, role, username, email, phone, hashPassword, formattedDate, status || 'Active']);

    // Send Credentials Email
    try {
      const { subject, html } = templates.staffCredentials(name, username, password);
      await sendEmail(email, subject, html);
    } catch (e) {
      console.error("Staff Welcome Email Failed:", e);
    }

    res.send("Staff Added Successfully");
  } catch (error) {
    console.error("Add Staff Error:", error);
    res.status(500).send(error.code === 'ER_DUP_ENTRY' ? "Email already exists" : "Server Error");
  }
};

exports.staff = async (req, res) => {
  try {
    const result = await query("SELECT * FROM staff", []);
    res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const { name, role, email, phone, username } = req.body;
  try {
    const sql = `UPDATE staff SET name=?, role=?, email=?, phone=?, username=? WHERE id=?`;
    await query(sql, [name, role, email, phone, username, id]);
    res.send("Updated Successfully");
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    await query(`DELETE FROM staff WHERE id=?`, [id]);
    res.send("delete");
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await query("UPDATE staff SET status=? WHERE id=?", [status, id]);
    res.send("Status updated");
  } catch (err) {
    res.status(500).send("Error updating status");
  }
};