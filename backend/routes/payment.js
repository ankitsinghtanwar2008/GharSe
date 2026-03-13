const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: "YOUR_RAZORPAY_KEY",
  key_secret: "YOUR_RAZORPAY_SECRET",
});

router.post("/create-order", async (req, res) => {

  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "order_rcptid_" + Date.now(),
  };

  try {

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {

    res.status(500).send(err);

  }

});

module.exports = router;