const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentMethodSchema = new mongoose.Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    methods: [
        {
            method: {
                type: String,
                enum: ['card', 'bank_transfer', 'paypal'],
                required: true,
            },
            details: {
                type: Object,
                required: true,
            },
        },
    ],
});

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);
module.exports = PaymentMethod;