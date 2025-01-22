const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const asyncHandler = require("../middleware/AsyncHandler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

//Router for adding a product to the cart
router.post('/', asyncHandler(async (req,res)=>{
    const userId = req.user.id;
    const {product, quantity} = req.body;
    const newQuantity = Number(quantity);

    // Validate that `quantity` is a valid number and greater than 0
    if (isNaN(newQuantity) || newQuantity <= 0) {
        return res.status(400).send("Quantity must be a positive number.");
    }

    //Checking if product ID is valid
    if(!isValidObjectId(product)){
        return res.status(400).send("Invalid product ID!");
    }

    const productExist = await Product.findById(product);
    if(!productExist) return res.status(404).send("No such product exists!");

    //Adding to the cart
    const productDetails = {
        product: product,
        quantity: newQuantity,
        price: productExist.price
    }

    //If the product already exists in the cart
    const existProduct = await Cart.findOne({customer: userId, 'products.product': product});
    if(existProduct){
        const existingProduct = existProduct.products.find(p => p.product.toString() === product.toString());

        const newCartExistingProduct = await Cart.findOneAndUpdate({customer : userId, 'products.product': product},
            {$set : {'products.$.quantity' : existingProduct.quantity + newQuantity},
            $inc: {totalNoOfProducts: newQuantity, totalCost: (newQuantity * (productExist.price))}},
            {new: true, runValidators: true,});
        return res.status(200).send(newCartExistingProduct);
    }

    //If the product isn't already present in the cart
    const newCart = await Cart.findOneAndUpdate({customer : userId},
                                {$push : {products : productDetails}, 
                                $inc: {totalNoOfProducts: newQuantity, totalCost: (newQuantity * (productExist.price))}},
                                {new: true, upsert: true, runValidators: true,});
    res.status(200).send(newCart);
}));

//Router for removing a product from the cart
router.delete('/:id', asyncHandler(async (req,res)=>{
    const productId = req.params.id;

    //Checking if product ID is valid
    if(!isValidObjectId(productId)){
        return res.status(400).send("Invalid product ID!");
    }
    const existProduct = await Cart.findOne({customer: req.user.id, 'products.product': productId});
    if(!existProduct) return res.status(404).send("Product isn't present in the cart");

    const existingProduct = existProduct.products.find(p => p.product.toString() === productId.toString());
    const newCart = await Cart.findOneAndUpdate({customer: req.user.id, 'products.product': productId},
        {$pull : {products: {product: productId}},
        $inc: {totalNoOfProducts: (-1 * existingProduct.quantity), totalCost: ((-1) * (existingProduct.quantity) * (existingProduct.price))}},
        {new: true, runValidators: true,}
    );
    res.status(200).send(newCart);
}));

//Router for getting all the products in cart
router.get('/', asyncHandler(async (req,res)=>{
    const userCart = await Cart.findOne({customer : req.user.id}).populate('products.product');
    if(userCart == null || userCart.products.length == 0) {
        return res.status(200).json({msg: "Cart is empty."});
    }
    res.status(200).json({userCart});
}));

//Router for increasing quantity of a product in cart
router.patch('/increase/:id', asyncHandler(async (req,res) => {
    const productId = req.params.id;

    //Checking if product ID is valid
    if(!isValidObjectId(productId)){
        return res.status(400).send("Invalid product ID!");
    }
    const existProduct = await Cart.findOne({customer: req.user.id, 'products.product': productId});
    if(!existProduct) return res.status(404).send("Product isn't present in the cart");

    const existingProduct = existProduct.products.find(p => p.product.toString() === productId.toString());

    const newCartExistingProduct = await Cart.findOneAndUpdate({customer : req.user.id, 'products.product': productId},
        {$set : {'products.$.quantity' : existingProduct.quantity + 1},
        $inc: {totalNoOfProducts: 1, totalCost: (existingProduct.price)}},
        {new: true, runValidators: true,});
    return res.status(200).send(newCartExistingProduct);
}));

//Router for decreasing quantity of a product in cart
router.patch('/decrease/:id', asyncHandler(async (req,res) => {
    const productId = req.params.id;

    //Checking if product ID is valid
    if(!isValidObjectId(productId)){
        return res.status(400).send("Invalid product ID!");
    };
    const existProduct = await Cart.findOne({customer: req.user.id, 'products.product': productId});
    if(!existProduct) return res.status(404).send("Product isn't present in the cart");

    const existingProduct = existProduct.products.find(p => p.product.toString() === productId.toString());
    if(existingProduct.quantity == 1){
        const newCart = await Cart.findOneAndUpdate({customer: req.user.id, 'products.product': productId},
            {$pull : {products: {product: productId}},
            $inc: {totalNoOfProducts: -1, totalCost: ((-1) * (existingProduct.price))}},
            {new: true, runValidators: true,}
        );
        return res.status(200).send(newCart);
    }

    const newCartExistingProduct = await Cart.findOneAndUpdate({customer : req.user.id, 'products.product': productId},
        {$set : {'products.$.quantity' : existingProduct.quantity - 1},
        $inc: {totalNoOfProducts: -1, totalCost: ((-1) *existingProduct.price)}},
        {new: true, runValidators: true,});
    return res.status(200).send(newCartExistingProduct);
}));


module.exports = router;