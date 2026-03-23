const express = require("express");
const router = express.Router();

const { addApplication } = require("../controllers/itemControllers");

const { addStaff , staff , updateStaff , deleteStaff ,updateStatus} = require("../controllers/admiControllers");

router.post("/addApplication", addApplication);

// Manage Staff
router.post("/addStaff", addStaff);
router.get('/staff',staff)
router.put("/updateStaff/:id", updateStaff);
router.delete("/deleteStaff/:id" ,deleteStaff)
router.put("/updateStatus/:id", updateStatus);


module.exports = router;
