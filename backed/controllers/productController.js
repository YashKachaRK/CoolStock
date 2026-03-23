const db = require("../config/db");

exports.getAllProduct = (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
};

exports.addProducts = (req, res) => {
  const { name, category, unit, price, stock, lowThreshold } = req.body;

  const sql =
    "INSERT INTO products (name, category, unit, price, stock, lowThreshold) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [name, category, unit, price, stock, lowThreshold],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "Product added" });
    },
  );
};

exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const { name, price, stock, lowThreshold } = req.body;

  const sql =
    "UPDATE products SET name=?, price=?, stock=?, lowThreshold=? WHERE id=?";

  db.query(sql, [name, price, stock, lowThreshold, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "Product updated" });
  });
};

exports.restock = (req, res) => {
  const id = req.params.id;
  const { qty } = req.body;

  const sql = "UPDATE products SET stock = stock + ? WHERE id = ?";

  db.query(sql, [qty, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "Stock updated" });
  });
};


exports.deleteProdcuts = (req,res)=>{
  
  const id = req.params.id;

  try {
    db.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
}