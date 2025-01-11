const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new mongoose.Schema({
    orderId: [{
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        }
    }],
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentMethodId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod', required: true },
    amount: {type: Number, required: true},
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    createdAt: {type: Date, default: Date.now}
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;