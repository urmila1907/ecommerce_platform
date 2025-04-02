const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const authenticateToken = require("../middleware/Auth");
const Product = require("../models/Product");

//Route for creating a product
router.post('/create-product', authenticateToken, async (req,res)=>{
    const userRole = req.user.role;

    //Checking whether the user has admin access
    if(userRole != 'Admin') return res.status(403).send("Access denied!");

    const {productName, price, quantity, description} = req.body;
    try{
        //Creating a new product
        const newProduct = new Product({productName, price, quantity, description});
        await newProduct.save();
        res.status(201).json({newProduct});
    }
    catch(err){
        res.status(500).send("Server error: " + err);
    }
})

//Route for searching products
router.get("/search", async(req,res)=>{
    try{
        const {query} = req.query;
        if(!query){
            return res.status(400).json({message: "Search query is required"});
        }
        const products = await Product.find({
            productName: {$regex: query, $options: "i"}
        });
        res.status(200).json({products});
    }
    catch(err){
        res.status(500).json({ message: "Server error", err });
    }
});

//Route for updating a product
router.patch('/:id', authenticateToken, async (req,res)=>{
    const userRole = req.user.role;

    //Checking whether the user has admin access
    if(userRole != 'Admin') return res.status(403).send("Access denied!");

    //Checking if product ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({msg: "Invalid product ID!"});
    }
    try{
        const {productName, price, quantity, description} = req.body;
        const productExist = await Product.findById(req.params.id);
        if(!productExist) return res.status(404).send("No such product exists!");

        //Updating the product's information
        await Product.findByIdAndUpdate(req.params.id,
            {productName, price, quantity, description}, {new: true, runValidators: true}
        );
        res.status(200).send("Product information updated successfully!");
    }
    catch(err){
        res.status(500).send("Server error: " + err.message);
    }
});

//Route for deleting a product
router.delete('/:id', authenticateToken, async (req,res)=>{
    const userRole = req.user.role;

    //Checking whether the user has admin access
    if(userRole != 'Admin') return res.status(403).send("Access denied!");

    //Checking if product ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({msg: "Invalid product ID!"});
    }
    try{
        const productExist = await Product.findById(req.params.id);
        if(!productExist) return res.status(404).send("No such product exists!");

        //Deleting the product
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).send("Product deleted successfully!");
    }
    catch(err){
        res.status(500).send("Server error: " + err.message);
    }
});

//Route for getting a product's information
router.get('/:id', async (req,res)=>{
    //Checking if product ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({msg: "Invalid product ID!"});
    }
    try{
        const productDetails = await Product.findById(req.params.id);
        if(!productDetails) return res.status(404).send("No such product exists!");
        res.status(200).json({productDetails});
    }
    catch(err){
        res.status(500).json({msg: "Server error: " + err.message});
    }
});

//Route for getting all products' information
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10, ...filters } = req.query;

        // Fetch products from MongoDB
        const dbProducts = await Product.find(filters).limit(limit * 1).skip((page - 1) * limit);
        const dbCount = await Product.countDocuments(filters);

        // Fetch products from FakeStoreAPI
        let fakeStoreProducts = [];
       /* try {
            const response = await axios.get("https://fakestoreapi.com/products");
            fakeStoreProducts = response.data;
        } catch (apiError) {
            console.error("FakeStoreAPI fetch failed:", apiError.message);
        } */

        // Combine MongoDB and FakeStoreAPI products
        const allProducts = [...dbProducts, ...fakeStoreProducts];

        // Apply pagination to combined results
        const startIndex = (page - 1) * limit;
        const paginatedProducts = allProducts.slice(startIndex, startIndex + limit);

        res.status(200).json({
            total: allProducts.length,
            currentPage: page,
            totalPages: Math.ceil(allProducts.length / limit),
            products: paginatedProducts,
        });

    } catch (err) {
        res.status(500).json({ msg: "Server error: " + err.message });
    }
});

module.exports = router;