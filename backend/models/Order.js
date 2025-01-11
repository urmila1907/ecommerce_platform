const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    product:{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {type: Number, required: true, min: 1},
    orderDate: {type: Date, default: Date.now},
    totalCost: {type: Number, required: true},
    customer:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;