const express = require("express");
const router = express.Router();

const { addApplication } = require("../controllers/itemControllers");

const { addStaff , staff , updateStaff , deleteStaff ,updateStatus} = require("../controllers/admiControllers");


const {getAllProduct , addProducts,updateProduct,restock , deleteProdcuts} = require('../controllers/productController')

router.post("/addApplication", addApplication);


// Manage Staff
router.post("/addStaff", addStaff);
router.get('/staff',staff)
router.put("/updateStaff/:id", updateStaff);
router.delete("/deleteStaff/:id" ,deleteStaff)
router.put("/updateStatus/:id", updateStatus);

//Products Manage
router.get('/products',getAllProduct)
router.post('/addProduct',addProducts)
router.put('/updateProduct/:id',updateProduct)
router.get('/restock/:id',restock)
router.delete('/deleteProduct/:id',deleteProdcuts)
module.exports = router;
