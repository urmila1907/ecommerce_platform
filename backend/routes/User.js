const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require("../models/User");
const authenticateToken = require("../middleware/Auth");
const cartRoutes = require('../routes/Cart');
const wishlistRoutes = require('../routes/Wishlist');
const orderRoutes = require('../routes/Order');
const paymentMethodRoutes = require('../routes/PaymentMethod');
const paymentRoutes = require("../routes/Payment");
const Product = require('../models/Product');

// Apply token authentication middleware to all /users routes
router.use(authenticateToken);

//Route for home page
router.get('/', async (req,res) => {
    try{
        const products = await Product.find();
        res.status(200).json({ products });
    }
    catch(err){
        res.status(400).send("Error in getting user's home page");
    }
});

//Route for getting profile (protected)
router.get('/profile', (req,res)=>{
    res.json({user: req.user});
});

//Route for logout
router.get('/logout', async (req,res)=>{
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: "/user"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: "/",
    });
    res.status(200).json({ message: "Logged out successfully" });
});

//Route for profile updation
router.patch('/profile-update', async (req,res)=>{
    const {newUserName} = req.body;
    try{
        const userExist = await User.find({userName: newUserName});
        if(userExist.length > 0) return res.status(400).send("Username already taken.");

        const updatedUser = await User.findOneAndUpdate({_id: req.user.id}, 
            {userName: newUserName},{runValidators: true, new: true});

        if(!updatedUser) return res.status(404).send("User not found!");
        res.status(200).send("User information updated successfully!");
    }
    catch(err){
        res.status(500).send("Server error: " + err);
    }
});

//Route for password updation
router.patch('/password-update', async (req,res)=>{
    const newPassword = req.body.password;
    try{
        const userInfo = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(newPassword, userInfo.password);

        if(isMatch) return res.status(400).send("New password is same as old password.");
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findOneAndUpdate({_id: req.user.id}, {password: newHashedPassword},{new: true, runValidators: true});
        res.status(200).send("Password updated successfully!");
    }
    catch(err){
        res.status(500).send("Server error: "+err);
    }
});

//Route for handling cart routes
router.use('/cart', cartRoutes);

//Route for handling wishlist routes
router.use('/wishlist', wishlistRoutes);

//Router for handling payment methods
router.use('/payment-method', paymentMethodRoutes);

//Router for handling payment routes
router.use('/payment', paymentRoutes);

//Route for handling order routes
router.use('/order', orderRoutes);

module.exports = router;