const express = require("express");
const router = express.Router();

const {
  addApplication,
} = require('../controllers/itemControllers')

router.post('/addApplication' , addApplication)

module.exports =router;