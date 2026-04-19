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

// Add data (Job Application)
exports.addApplication = async (req, res) => {
  const { full_name, email, phone, role, description } = req.body;

  try {
    await query(
      "INSERT INTO applications (full_name, email, phone, role, description) VALUES (?,?,?,?,?)",
      [full_name, email, phone, role, description]
    );

    // Send confirmation email
    try {
      const { subject, html } = templates.applicationReceived(full_name);
      await sendEmail(email, subject, html);
    } catch (e) {
      console.error("Email failed (Application Received)", e);
    }

    res.json({ message: "Added" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.getApplications = async (req, res) => {
  try {
    const result = await query("SELECT * FROM applications ORDER BY applied_at DESC", []);
    res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Handle Approval/Rejection
exports.updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // 1. Update the application status
    await query("UPDATE applications SET status = ? WHERE id = ?", [status, id]);

    // 2. If Approved/Accepted, create a staff account
    if (status === 'Accepted' || status === 'Approved') {
      const fetchResult = await query("SELECT * FROM applications WHERE id = ?", [id]);

      if (fetchResult.length > 0) {
        const applicant = fetchResult[0];
        const tempPassword = Math.random().toString(36).slice(-8); // Random 8-char password
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const username = applicant.full_name.toLowerCase().replace(/\s+/g, '_') + Math.floor(1000 + Math.random() * 9000);

        const mappedRole = applicant.role.includes('Manager') ? 'Manager' :
          applicant.role.includes('Delivery') ? 'Delivery' :
            applicant.role.includes('Cashier') ? 'Cashier' : 'Manager';

        const sqlStaff = `INSERT INTO staff (name, email, username, phone, role, password, status, joined) 
                          VALUES (?, ?, ?, ?, ?, ?, 'Active', CURDATE())`;

        try {
          await query(sqlStaff, [
            applicant.full_name,
            applicant.email,
            username,
            applicant.phone,
            mappedRole,
            hashedPassword
          ]);

          // 3. Send Credentials Email
          try {
            const { subject, html } = templates.staffCredentials(applicant.full_name, username, tempPassword);
            await sendEmail(applicant.email, subject, html);
            console.log(`Credentials sent to approved staff: ${applicant.email}`);
          } catch (emailErr) {
            console.error("Failed to send credentials email:", emailErr);
          }
        } catch (staffErr) {
          console.error("Failed to create staff record from application:", staffErr);
        }
      }
    }

    res.send("Status Updated");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};