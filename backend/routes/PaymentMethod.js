const express = require('express');
const router = express.Router();

const asyncHandler = require("../middleware/AsyncHandler");
const PaymentMethod = require("../models/PaymentMethod");

//Router for adding a payment method for a user
router.post('/', asyncHandler(async (req,res)=>{
    const {method, details} = req.body;
    const existPaymentMethod = await PaymentMethod.findOne({customerId: req.user.id});
    
    // Validate payment method
    if (!['card', 'bank_transfer', 'paypal'].includes(method)) {
        return res.status(400).send('Invalid payment method.');
    };

    if(existPaymentMethod && existPaymentMethod.methods.some(m => m.method === method)){
        return res.status(400).send("This payment method is already added!");
    };

    const newPaymentMethod = await PaymentMethod.findOneAndUpdate({customerId: req.user.id},
                                    {$push: {methods: {method, details}}}, {new:true, runValidators: true, upsert: true});
    return res.status(201).send({
        "message": "Payment method added successfully",
        "methodDetails": newPaymentMethod.methods
    });
}))

//Router for getting all payment methods for a user
router.get('/', asyncHandler( async(req,res)=>{
    const existPaymentMethod = await PaymentMethod.findOne({customerId: req.user.id});
    if(!existPaymentMethod){
        return res.status(404).send("No payment method has yet been added for this user.");
    }
    return res.status(200).send(existPaymentMethod.methods);
}))

module.exports = router;