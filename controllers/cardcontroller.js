const Stripe = require("stripe");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Card Payment
exports.initiateCardPayment = async (req, res) => {
  try {
    const { amount, currency, token } = req.body;

    const charge = await stripe.charges.create({
      amount: amount * 100, // Stripe works in cents
      currency,
      source: token,
      description: "Card Payment"
    });

    res.json(charge);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Card payment failed", error: error.message });
  }
};
