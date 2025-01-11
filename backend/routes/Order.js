const express = require('express');
const router = express.Router();

const Cart = require("../models/Cart");

//Route for placing an order
router.post('/place-order', async (req,res)=>{
    const cartProducts = await Cart.find({customer: req.user.id});
    console.log(cartProducts);
    res.status(200).send("Order placed");
});

module.exports = router;