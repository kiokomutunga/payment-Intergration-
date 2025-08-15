const express = require("express");
const { initiateCardPayment } = require("../controllers/cardcontroller");
const router = express.Router();

router.post("/pay", initiateCardPayment);

module.exports = router;
