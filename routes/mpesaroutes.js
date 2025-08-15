const express = require("express");
const { initiateMpesaPayment, mpesaCallback } = require("../controllers/mpesacontroller");
const router = express.Router();

router.post("/pay", initiateMpesaPayment);
router.post("/callback", mpesaCallback);

module.exports = router;
