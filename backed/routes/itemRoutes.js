const express = require("express");
const router = express.Router();

const { addApplication } = require("../controllers/itemControllers");

const { addStaff , staff , updateStaff , deleteStaff ,updateStatus} = require("../controllers/admiControllers");

const {loginStaff} = require ('../controllers/loginControllers')

router.post("/addApplication", addApplication);

// Manage Staff
router.post("/addStaff", addStaff);
router.get('/staff',staff)
router.put("/updateStaff/:id", updateStaff);
router.delete("/deleteStaff/:id" ,deleteStaff)
router.put("/updateStatus/:id", updateStatus);

// Login

router.post("/loginStaff",loginStaff)
module.exports = router;
