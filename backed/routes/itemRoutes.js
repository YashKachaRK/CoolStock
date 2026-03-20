const express = require("express");
const router = express.Router();

const { addApplication } = require("../controllers/itemControllers");

const { addStaff , staff} = require("../controllers/admiControllers");
router.post("/addApplication", addApplication);
router.post("/addStaff", addStaff);
router.get('/staff',staff)
module.exports = router;
