const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    products:[{
        product:{
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {type: Number, required: true, min: 1},
    }],
    orderDate: {type: Date, default: Date.now},
    totalCost: {type: Number, required: true},
    customer:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {type: String, 
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'},
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;