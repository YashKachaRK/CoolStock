const Product = require("../models/Product");
const emailService = require("../utils/emailService");
const Staff = require("../models/Staff");

// Helper to check and send low stock email (one-time)
const checkLowStockAndNotify = async (product) => {
  try {
    if (product.stock < product.lowThreshold && !product.low_stock_alert_sent) {
      // Find a manager to notify
      const manager = await Staff.findOne({ role: 'Manager' });
      if (manager && manager.email) {
        await emailService.sendLowStockAlert(manager.email, product);
        product.low_stock_alert_sent = true;
        await product.save();
      }
    } else if (product.stock >= product.lowThreshold && product.low_stock_alert_sent) {
      // Reset flag if stock is back up
      product.low_stock_alert_sent = false;
      await product.save();
    }
  } catch (err) {
    console.error("Low stock alert failed:", err.message);
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    
    // For each product, find the earliest expiry date from its batches
    const productsWithExpiry = await Promise.all(products.map(async (p) => {
      const nearestBatch = await ProductBatch.findOne({ product_id: p._id })
        .sort({ expiry_date: 1 }); // Sort by earliest expiry
        
      return {
        ...p.toObject(),
        id: p._id,
        nearest_expiry: nearestBatch ? nearestBatch.expiry_date : null
      };
    }));

    res.send(productsWithExpiry);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.addProducts = async (req, res) => {
  try {
    const { name, category, unit, flavor, description, price, stock, lowThreshold, expiry_date } = req.body;
    const newProduct = new Product({ name, category, unit, flavor, description, price, stock, lowThreshold });
    await newProduct.save();
    
    // Create initial batch if expiry date is provided
    if (expiry_date && stock > 0) {
      const initialBatch = new ProductBatch({
        product_id: newProduct._id,
        batch_number: `BATCH-INIT-${Date.now().toString().slice(-4)}`,
        quantity: stock,
        expiry_date: expiry_date,
        received_at: new Date()
      });
      await initialBatch.save();
    }

    // Check initial stock
    await checkLowStockAndNotify(newProduct);

    res.send({ message: "Product added", product: { ...newProduct.toObject(), id: newProduct._id } });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, stock, lowThreshold, flavor, description } = req.body;
    const updated = await Product.findByIdAndUpdate(id, { name, price, stock, lowThreshold, flavor, description }, { new: true });
    
    if (updated) await checkLowStockAndNotify(updated);

    res.send({ message: "Product updated" });
  } catch (err) {
    res.status(500).send(err);
  }
};

const ProductBatch = require("../models/ProductBatch");

exports.restock = async (req, res) => {
  try {
    const id = req.params.id;
    const { qty, expiry_date, batch_code } = req.body;
    const product = await Product.findById(id);
    
    if (product) {
       product.stock += parseInt(qty || 0);
       await product.save();
       
       // If expiry date is provided, also create a Batch record
       if (expiry_date) {
         const newBatch = new ProductBatch({
           product_id: id,
           batch_number: batch_code || null,
           quantity: parseInt(qty || 0),
           expiry_date: expiry_date,
           received_at: new Date()
         });
         await newBatch.save();
       }

       // Check/Reset low stock alert
       await checkLowStockAndNotify(product);

       res.send({ message: "Stock updated" + (expiry_date ? " and batch recorded" : "") });
    } else {
       res.status(404).send({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteProdcuts = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Export the helper for other controllers
exports.checkLowStockAndNotify = checkLowStockAndNotify;
