const db = require("../config/db");
const { sendEmail, templates } = require("../utils/emailService");

exports.getAllProduct = (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
};

exports.addProducts = (req, res) => {
  const { name, category, unit, price, stock, lowThreshold } = req.body;
  const sql = "INSERT INTO products (name, category, unit, price, stock, lowThreshold) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, category, unit, price, stock, lowThreshold], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "Product added" });
  });
};

exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const { name, price, stock, lowThreshold, category, unit } = req.body;
  const sql = "UPDATE products SET name=?, price=?, stock=?, lowThreshold=?, category=?, unit=? WHERE id=?";
  db.query(sql, [name, price, stock, lowThreshold, category, unit, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "Product updated" });
  });
};

exports.restock = (req, res) => {
  const id = req.params.id;
  const { qty, expiry_date, batch_code } = req.body;

  if (!qty || !expiry_date) {
    return res.status(400).send({ message: "Quantity and Expiry Date are required" });
  }

  const sqlProduct = "UPDATE products SET stock = stock + ? WHERE id = ?";
  const sqlBatch = "INSERT INTO product_batches (product_id, quantity, expiry_date, batch_code) VALUES (?, ?, ?, ?)";

  db.query(sqlProduct, [qty, id], (err, result) => {
    if (err) return res.status(500).send(err);

    db.query(sqlBatch, [id, qty, expiry_date, batch_code || 'BATCH-' + Date.now()], (batchErr) => {
      if (batchErr) console.error("Error creating product batch:", batchErr);
      res.send({ message: "Stock updated and batch recorded" });
    });
  });
};

exports.deleteProdcuts = (req, res) => {
  const id = req.params.id;
  try {
    db.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get batches expiring soon (within 7 days)
exports.getExpiringProducts = (req, res) => {
  const sql = `
    SELECT pb.*, p.name as product_name 
    FROM product_batches pb 
    JOIN products p ON pb.product_id = p.id 
    WHERE pb.expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    AND pb.quantity > 0
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

// Manual trigger for alerts (Low stock + Expiry)
exports.triggerAlerts = (req, res) => {
  const expirySql = `
    SELECT pb.*, p.name as product_name 
    FROM product_batches pb 
    JOIN products p ON pb.product_id = p.id 
    WHERE pb.expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    AND pb.quantity > 0
  `;
  const lowStockSql = "SELECT name, stock FROM products WHERE stock <= lowThreshold";
  db.query(expirySql, (err, expiryItems) => {
    if (err) return res.status(500).send(err);
    db.query(lowStockSql, async (err2, lowStockItems) => {
      if (err2) return res.status(500).send(err2);

      // Email Notification Logic
      if (expiryItems.length > 0) {
        const item = expiryItems[0];
        try {
          const { subject, html } = templates.expiryAlert(item.product_name, item.expiry_date, item.quantity);
          await sendEmail(process.env.EMAIL_USER, subject, html);
        } catch (e) { console.error("Expiry email alert failed:", e); }
      }
      if (lowStockItems.length > 0) {
        const item = lowStockItems[0];
        try {
          const { subject, html } = templates.lowStockAlert(item.name, item.stock);
          await sendEmail(process.env.EMAIL_USER, subject, html);
        } catch (e) { console.error("Low stock email alert failed:", e); }
      }

      res.json({
        message: "Alerts check completed",
        expiryItemsCount: expiryItems.length,
        lowStockCount: lowStockItems.length
      });
    });
  });
};