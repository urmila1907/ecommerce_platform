const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["paid", "failed"],
    required: true,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
