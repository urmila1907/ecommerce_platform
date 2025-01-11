const express = require('express');
const router = express.Router();

const asyncHandler = require("../middleware/AsyncHandler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const CartToOrder = asyncHandler(async (req,res,next)=>{
    const userId = req.user.id;
    const cartExist = await Cart.findOne({customer: userId});
    
    if(cartExist == null || cartExist.products.length == 0){
        return res.status(404).send("Cart is empty. Please add some products to the cart!");
    }
    const existProducts = cartExist.products;
    req.products = existProducts;
    next();
});

module.exports = CartToOrder;