const ProductBatch = require("../models/ProductBatch");
const Product = require("../models/Product");
const emailService = require("../utils/emailService");
const Staff = require("../models/Staff");

// Add a new batch (Manager restocks a product)
exports.addBatch = async (req, res) => {
    try {
        const { product_id, batch_number, quantity, expiry_date } = req.body;

        const batch = new ProductBatch({
            product_id,
            batch_number: batch_number || null,
            quantity,
            expiry_date,
            received_at: new Date(),
            expiry_alert_sent: false,
        });
        await batch.save();

        // Also increase the product stock
        await Product.findByIdAndUpdate(product_id, { $inc: { stock: quantity } });

        res.status(201).json({ message: "Batch added and stock updated", batch });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding batch");
    }
};

// Get all batches for a product
exports.getBatchesByProduct = async (req, res) => {
    try {
        const { product_id } = req.params;
        const batches = await ProductBatch.find({ product_id })
            .populate('product_id', 'name category unit')
            .sort({ received_at: -1 });
        res.json(batches.map(b => ({ ...b.toObject(), id: b._id })));
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching batches");
    }
};

// Get all batches (Admin/Manager view)
exports.getAllBatches = async (req, res) => {
    try {
        const batches = await ProductBatch.find()
            .populate('product_id', 'name category unit')
            .sort({ received_at: -1 });
        res.json(batches.map(b => ({ ...b.toObject(), id: b._id })));
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching batches");
    }
};

// Get expiring batches (within 30 days) and send one-time emails
exports.getExpiringBatches = async (req, res) => {
    try {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const batches = await ProductBatch.find({
            expiry_date: { $lte: thirtyDaysFromNow },
            expiry_alert_sent: false,
        }).populate('product_id', 'name category');

        if (batches.length > 0) {
            const manager = await Staff.findOne({ role: 'Manager' });
            if (manager && manager.email) {
                for (const batch of batches) {
                    await emailService.sendExpiryAlert(manager.email, batch.product_id, batch);
                    batch.expiry_alert_sent = true;
                    await batch.save();
                }
            }
        }

        res.json(batches.map(b => ({ ...b.toObject(), id: b._id })));
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching expiring batches");
    }
};

// Mark alert as sent
exports.markAlertSent = async (req, res) => {
    try {
        await ProductBatch.findByIdAndUpdate(req.params.id, { expiry_alert_sent: true });
        res.json({ message: "Alert marked as sent" });
    } catch (err) {
        res.status(500).send("Error updating alert status");
    }
};

// Delete a batch
exports.deleteBatch = async (req, res) => {
    try {
        const batch = await ProductBatch.findById(req.params.id);
        if (!batch) return res.status(404).send("Batch not found");

        // Reduce product stock when removing a batch
        await Product.findByIdAndUpdate(batch.product_id, { $inc: { stock: -batch.quantity } });
        await ProductBatch.findByIdAndDelete(req.params.id);

        res.json({ message: "Batch deleted and stock adjusted" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting batch");
    }
};

// Bulk remove all expired batches
exports.removeExpiredBatches = async (req, res) => {
    try {
        const today = new Date();
        const expiredBatches = await ProductBatch.find({ expiry_date: { $lt: today } });
        
        if (expiredBatches.length === 0) {
            return res.json({ message: "No expired batches found." });
        }

        let removedCount = 0;
        let adjustedStock = 0;

        for (const batch of expiredBatches) {
            // Reduce product stock
            await Product.findByIdAndUpdate(batch.product_id, { $inc: { stock: -batch.quantity } });
            await ProductBatch.findByIdAndDelete(batch._id);
            removedCount++;
            adjustedStock += batch.quantity;
        }

        res.json({ 
            message: `Successfully removed ${removedCount} expired batches and adjusted stock by -${adjustedStock}.`,
            removedCount,
            adjustedStock
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error removing expired batches");
    }
};
