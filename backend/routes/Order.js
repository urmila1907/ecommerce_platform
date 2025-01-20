const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const asyncHandler = require("../middleware/AsyncHandler");
const CartToOrder = require("../middleware/CartToOrder");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Payment = require("../models/Payment");

// Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

//Router for placing an order
router.post('/', CartToOrder, asyncHandler(async (req,res) =>{
    const { razorpayOrderId } = req.body;

    // Check if the payment is verified
    const payment = await Payment.findOne({ razorpay_order_id: razorpayOrderId, status: "paid" });
    if (!payment) {
        return res.status(400).send("Payment not verified or invalid payment details.");
    }

    const products = req.products;
    const allOrderDetails = await Promise.all(
        products.map(product => Order.create({
            product: product.product,
            quantity: product.quantity,
            totalCost: product.quantity * product.price,
            customer: req.user.id
        }))
    );    
    await Cart.findOneAndUpdate({customer: req.user.id},
        {$set: {products: []}, totalNoOfProducts: 0, totalCost: 0},
        {new: true, runValidators: true,}
    );
    res.status(201).send({
        message: "Order processed successfully",
        allOrderDetails
    });
}));

//Router for getting all orders for a user
router.get('/', asyncHandler(async (req,res)=>{
    const orderDetails = await Order.find({customer: req.user.id});
    if(!orderDetails){
        return res.status(200).send("No orders present. Do some shopping!");
    }
    return res.status(200).send(orderDetails);
}));

//Router for getting a specific order for a user
router.get('/:id', asyncHandler(async (req,res)=>{
    const orderId = req.params.id;

    //Checking if order ID is valid
    if(!isValidObjectId(orderId)){
        return res.status(400).send("Invalid product ID!");
    }
    const orderExist = await Order.findById(orderId);
    if(!orderExist) return res.status(404).send("No such order exists!");

    res.status(200).send(orderExist);
}));

//Route for cancelling an order for a user
router.patch('/:id', asyncHandler(async (req,res)=>{
    const orderId = req.params.id;

    //Checking if order ID is valid
    if(!isValidObjectId(orderId)){
        return res.status(400).send("Invalid product ID!");
    }
    const orderExist = await Order.findById(orderId);
    if(!orderExist) return res.status(404).send("No such order exists!");

    if (orderExist.status === 'cancelled' || orderExist.status === 'delivered') {
        return res.status(400).send("Order cannot be cancelled.");
    }    

    const newOrderDetails = await Order.findByIdAndUpdate(orderId,
        {status: 'cancelled'},
        {new: true, runValidators: true,}
    );
    res.status(200).send({
        message: "Order is successfully cancelled!",
        OrderDetails: newOrderDetails
    });
}));

module.exports = router;