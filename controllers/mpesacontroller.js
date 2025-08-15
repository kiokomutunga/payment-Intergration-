const axios = require("axios");
const moment = require("moment");
require("dotenv").config();

const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortCode = process.env.MPESA_SHORTCODE;
const passKey = process.env.MPESA_PASSKEY;
const callbackURL = process.env.MPESA_CALLBACK_URL;

// 🔑 Generate Access Token
async function getToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const res = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return res.data.access_token;
}

// 📲 STK Push Payment
exports.initiateMpesaPayment = async (req, res) => {
  try {
    const { phone, amount, accountRef } = req.body;
    const token = await getToken();

    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString("base64");

    const payload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: callbackURL,
      AccountReference: accountRef || "Order001",
      TransactionDesc: "Payment of order"
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "M-Pesa payment failed", error: error.response?.data });
  }
};

// ✅ Handle Callback from M-Pesa
exports.mpesaCallback = async (req, res) => {
  console.log("M-Pesa Callback:", req.body);
  // TODO: Save transaction to DB
  res.json({ message: "Callback received" });
};
