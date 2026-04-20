const express = require("express");
const router = express.Router();

// 1. Import the new Auth Controller
const { loginStaff } = require("../controllers/authController");

// 2. Import existing controllers
const { addApplication } = require("../controllers/itemControllers");
const { addStaff, staff, updateStaff, deleteStaff, updateStatus } = require("../controllers/admiControllers");
const { getAllProduct, addProducts, updateProduct, restock, deleteProdcuts } = require('../controllers/productController');

// ================= AUTH ROUTES =================
router.post("/loginStaff", loginStaff);

// ================= STAFF ROUTES =================
router.post("/addStaff", addStaff);
router.get('/staff', staff);
router.put("/updateStaff/:id", updateStaff);
router.delete("/deleteStaff/:id", deleteStaff);
router.put("/updateStatus/:id", updateStatus);

// ================= PRODUCT ROUTES =================
router.get('/products', getAllProduct);
router.post('/addProduct', addProducts);
router.put('/updateProduct/:id', updateProduct);
router.get('/restock/:id', restock);
router.delete('/deleteProduct/:id', deleteProdcuts);

router.post("/addApplication", addApplication);

module.exports = router;