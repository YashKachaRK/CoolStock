const express = require("express");
const router = express.Router();

const { addApplication } = require("../controllers/itemControllers");

const { addStaff , staff , updateStaff , deleteStaff} = require("../controllers/admiControllers");
router.post("/addApplication", addApplication);
router.post("/addStaff", addStaff);
router.get('/staff',staff)
router.put("/updateStaff/:id", updateStaff);
router.delete("/deleteStaff/:id" ,deleteStaff)
module.exports = router;
