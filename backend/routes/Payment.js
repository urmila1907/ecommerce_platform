const express = require('express');
const Razorpay = require("razorpay");
const router = express.Router();
const crypto = require("crypto");
const asyncHandler = require("../middleware/AsyncHandler");
const Payment = require("../models/Payment");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//Router for creating order for payment
router.post("/create", asyncHandler(async (req, res) => {
    const { amount, currency = "INR", receipt } = req.body;
    const options = {
        amount: amount * 100, // Razorpay accepts amount in paise
        currency,
        receipt,
    };
    const order = await razorpay.orders.create(options);

    res.status(201).json({
        id: order.id,
        currency: order.currency,
        amount: order.amount,
    });
}));

// Handle payment verification
router.post("/verify", async (req, res) => {
const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

    if (generatedSignature === razorpay_signature) {
        const payment = new Payment({
        userId: req.user.id,
        razorpay_order_id,
        razorpay_payment_id,
        status: "paid",
        });

        await payment.save();

        res.status(200).json({ success: true, message: "Payment verified successfully", payment });
    } else {
        res.status(400).json({ success: false, message: "Payment verification failed" });
    }
});

// Get all payments for a user
router.get("/", async (req, res) => {
    const payments = await Payment.find({ userId: req.user.id });
    res.status(200).json(payments);
});
  

module.exports = router;