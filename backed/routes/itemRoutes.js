const express = require("express");
const router = express.Router();

// 1. Import the new Auth Controller
const { loginStaff } = require("../controllers/authController");

// 2. Import existing controllers
const { addApplication, getApplications, updateApplicationStatus } = require("../controllers/itemControllers");
const { addStaff, staff, updateStaff, deleteStaff, updateStatus } = require("../controllers/admiControllers");
const { getAllProduct, addProducts, updateProduct, restock, deleteProdcuts, getExpiringProducts, triggerAlerts } = require('../controllers/productController');

// 3. Import new Customer and Order controllers
const { getAllCustomers, getCustomerProfile, updateCustomerProfile, addCustomer, updateCustomerStatus, deleteCustomer } = require("../controllers/customerControllers");
const { placeOrder, getAllOrders, updateOrderStatus, getOrderDetails, getMyOrders } = require("../controllers/orderControllers");
const { getAdminStats, getManagerStats } = require("../controllers/dashboardControllers");

// 4. Import Auth Middleware
const auth = require("../middle/authMiddleware");

// ================= AUTH ROUTES =================
router.post("/loginStaff", loginStaff);

// ================= STAFF ROUTES =================
router.post("/addStaff", auth(['Admin']), addStaff);
router.get('/staff', auth(['Admin']), staff);
router.put("/updateStaff/:id", auth(['Admin']), updateStaff);
router.delete("/deleteStaff/:id", auth(['Admin']), deleteStaff);
router.put("/updateStatus/:id", auth(['Admin']), updateStatus);

// ================= CUSTOMER ROUTES =================
router.get("/customers", auth(['Admin', 'Manager']), getAllCustomers);
router.get("/customerProfile", auth(['Customer']), getCustomerProfile);
router.put("/updateCustomerProfile", auth(['Customer']), updateCustomerProfile);
router.post("/addCustomer", auth(['Admin', 'Manager']), addCustomer);
router.put("/updateCustomerStatus/:id", auth(['Admin', 'Manager']), updateCustomerStatus);
router.delete("/deleteCustomer/:id", auth(['Admin']), deleteCustomer);

// ================= PRODUCT ROUTES =================
router.get('/products', auth(), getAllProduct); // All logged in users can see products
router.post('/addProduct', auth(['Admin', 'Manager']), addProducts);
router.put('/updateProduct/:id', auth(['Admin', 'Manager']), updateProduct);
router.put('/restock/:id', auth(['Admin', 'Manager']), restock);
router.get('/expiring-products', auth(['Admin', 'Manager']), getExpiringProducts);
router.get('/trigger-alerts', auth(['Admin', 'Manager']), triggerAlerts);
router.delete('/deleteProduct/:id', auth(['Admin']), deleteProdcuts);

// ================= ORDER ROUTES =================
router.get("/orders", auth(['Admin', 'Manager', 'Delivery', 'Cashier']), getAllOrders);
router.post("/placeOrder", auth(['Customer']), placeOrder); // Only customers can place orders
router.put("/updateOrderStatus/:id", auth(['Admin', 'Manager', 'Delivery', 'Cashier']), updateOrderStatus);
router.get("/orderDetails/:id", auth(), getOrderDetails);

// ================= DASHBOARD ROUTES =================
router.get("/adminStats", auth(['Admin']), getAdminStats);
router.get("/managerStats", auth(['Admin', 'Manager']), getManagerStats);

router.get("/myOrders", auth(['Customer']), getMyOrders);

router.get("/admin/applications", auth(['Admin']), getApplications);
router.put("/admin/updateApplication/:id", auth(['Admin']), updateApplicationStatus);

router.post("/addApplication", addApplication);

module.exports = router;