const express = require("express");
const router = express.Router();

// ── Controllers ───────────────────────────────────────────────────────────
const { loginStaff, forgotPassword, resetPassword } = require("../controllers/authController");
const { addApplication } = require("../controllers/itemControllers");
const { addStaff, staff, updateStaff, deleteStaff, updateStatus, getStaffProfile, updateStaffProfile } = require("../controllers/admiControllers");
const { getAllProduct, addProducts, updateProduct, restock, deleteProdcuts } = require('../controllers/productController');
const { getAllCustomers } = require('../controllers/customerControllers');
const { getAdminStats, getManagerStats } = require("../controllers/dashboardControllers");
const {
    placeOrder, assignOrder, dispatchOrder, markDelivered, verifyPayment,
    getAllOrders, getAuditLog, getOrderHistory, getOrderDetails,
    getMyOrders, getAssignedOrders, getDeliveryHistory,
    getPendingPayments, getPendingOrders, getDeliveryBoys,
    cancelOrder, updateOrderStatus, getVerifiedPayments
} = require('../controllers/orderControllers');
const {
    addBatch, getBatchesByProduct, getAllBatches,
    getExpiringBatches, markAlertSent, deleteBatch
} = require('../controllers/productBatchController');
const emailService = require("../utils/emailService");

const Application = require("../models/Application");
const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");

// ── AUTH ─────────────────────────────────────────────────────────────────
router.post("/loginStaff", loginStaff);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ── STAFF (Admin) ─────────────────────────────────────────────────────────
router.post("/addStaff",          addStaff);
router.get('/staff',              staff);
router.put("/updateStaff/:id",    updateStaff);
router.delete("/deleteStaff/:id", deleteStaff);
router.put("/updateStatus/:id",   updateStatus);
router.get('/staffProfile/:id',        getStaffProfile);
router.put('/staffProfile/:id',        updateStaffProfile);

// ── PRODUCTS (Admin / Manager) ───────────────────────────────────────────
router.get('/products',              getAllProduct);
router.post('/addProduct',           addProducts);
router.put('/updateProduct/:id',     updateProduct);
router.get('/restock/:id',           restock);
router.delete('/deleteProduct/:id',  deleteProdcuts);

// ── CUSTOMERS (Admin / Manager) ──────────────────────────────────────────
router.get('/customers', getAllCustomers);

// ── PRODUCT BATCHES (product_batches table) ──────────────────────────────
router.post('/product-batches',              addBatch);
router.get('/product-batches',               getAllBatches);
router.get('/product-batches/expiring',      getExpiringBatches);
router.get('/product-batches/:product_id',   getBatchesByProduct);
router.put('/product-batches/alert/:id',     markAlertSent);
router.delete('/product-batches/:id',        deleteBatch);

// ── ORDERS — role-based workflow ─────────────────────────────────────────
// Customer
router.post('/orders',               placeOrder);
router.get('/orders/my',             getMyOrders);

// Manager
router.get('/orders/pending',        getPendingOrders);       // status: Ordered
router.get('/orders/delivery-boys',  getDeliveryBoys);
router.put('/orders/assign/:id',     assignOrder);

// Delivery
router.get('/orders/assigned',       getAssignedOrders);      // status: Assigned, In Transit
router.get('/orders/history',        getDeliveryHistory);     // status: Deposited, Paid
router.put('/orders/dispatch/:id',   dispatchOrder);          // → In Transit
router.put('/orders/delivered/:id',  markDelivered);          // → Deposited

// Cashier
router.get('/orders/pending-payments',       getPendingPayments);  // status: Deposited
router.get('/orders/verified-payments',      getVerifiedPayments); // status: Paid (filter by cashier_id)
router.put('/orders/verify-payment/:id',     verifyPayment);       // → Paid

// Admin + Manager
router.get('/orders',                getAllOrders);
router.get('/orders/audit',          getAuditLog);
router.get('/orders/:id/history',    getOrderHistory);         // order_history for one order
router.get('/orders/:id',            getOrderDetails);

// Generic overrides
router.put('/orders/status/:id',     updateOrderStatus);
router.put('/orders/cancel/:id',     cancelOrder);

// ── DASHBOARD ────────────────────────────────────────────────────────────
router.get('/adminStats',   getAdminStats);
router.get('/managerStats', getManagerStats);

// ── JOB APPLICATIONS (job_applications table) ────────────────────────────
router.post('/addApplication', addApplication);

router.get('/admin/applications', async (req, res) => {
    try {
        const apps = await Application.find().sort({ applied_at: -1 });
        res.json(apps.map(a => ({ ...a.toObject(), id: a._id })));
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/admin/updateApplication/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
        
        // ── Trigger Logic: Application Accepted ──
        if (status === 'Accepted' && app.email) {
            // 1. Generate Temporary Password
            const tempPassword = `Cool@${Math.floor(1000 + Math.random() * 9000)}`;
            
            // 2. Add to Staff Table
            const hashPassword = await bcrypt.hash(tempPassword, 10);
            const newStaff = new Staff({
                name: app.full_name,
                email: app.email,
                phone: app.phone,
                role: app.role, // Assuming applicant.role matches staff roles (Manager, Delivery, Cashier)
                password: hashPassword,
                status: 'Active'
            });
            await newStaff.save();

            // 3. Send Email with Credentials
            emailService.sendApplicationAccepted(app, {
                email: app.email,
                password: tempPassword
            });
        }

        res.json({ message: "Updated" });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;