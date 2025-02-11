const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const asyncHandler = require("../middleware/AsyncHandler");
const Product = require("../models/Product");
const Wishlist = require("../models/Wishlist");

// Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

//Router for adding a product to the wishlist
router.post('/:id', asyncHandler(async (req,res)=>{
    const userId = req.user.id;
    const product = req.params.id;

    //Checking if product ID is valid
    if(!isValidObjectId(product)){
        return res.status(400).json({msg: "Invalid product ID!"});
    }

    const productExist = await Product.findById(product);
    if(!productExist) return res.status(404).json({msg: "No such product exists!"});

    const productDetails = {
        product: product,
        price: productExist.price
    }

    //If the product already exists in the wishlist
    const existProduct = await Wishlist.findOne({customer: userId, 'products.product': product});
    if(existProduct){
        return res.status(400).json({msg: "Product is already added to the wishlist!"});
    };

    //If the product isn't already present in the wishlist
    const newWishlist = await Wishlist.findOneAndUpdate({customer : userId},
                                {$push : {products : productDetails}, 
                                $inc: {totalNoOfProducts: 1}},
                                {new: true, upsert: true, runValidators: true});
    res.status(200).json({newWishlist});
}));

//Router for checking if a product already exists in the wishlist
router.get('/:id', asyncHandler(async (req,res) =>{
    const productId = req.params.id;

    //Checking if product ID is valid
    if(!isValidObjectId(productId)){
        return res.status(400).json({msg: "Invalid product ID!"});
    }
    const existProduct = await Wishlist.findOne({customer: req.user.id, 'products.product': productId});
    if(!existProduct) return res.status(200).json({exist: "false"});

    res.status(200).json({exist: "true"});
}))

//Router for removing a product from the wishlist
router.delete('/:id', asyncHandler(async (req,res)=>{
    const productId = req.params.id;

    //Checking if product ID is valid
    if(!isValidObjectId(productId)){
        return res.status(400).send("Invalid product ID!");
    }
    const existProduct = await Wishlist.findOne({customer: req.user.id, 'products.product': productId});
    if(!existProduct) return res.status(404).json({msg: "Product isn't present in the wishlist"});

    const newWishlist = await Wishlist.findOneAndUpdate({customer: req.user.id, 'products.product': productId},
        {$pull : {products: {product: productId}},
        $inc: {totalNoOfProducts: -1}},
        {new: true, runValidators: true}
    );
    res.status(200).json({newWishlist});
}));

//Router for getting all the products in wishlist
router.get('/', asyncHandler(async (req,res)=>{
    const userWishlist = await Wishlist.findOne({customer : req.user.id}).populate('products.product');
    if(userWishlist == null || userWishlist.products.length == 0) {
        return res.status(200).json({msg: "Wishlist is empty."});
    }
    res.status(200).json({products: userWishlist.products});
}));

module.exports = router;