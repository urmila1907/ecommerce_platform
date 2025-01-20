const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../models/User");
const {authenticateToken, logout} = require("../middleware/Auth");
const cartRoutes = require('../routes/Cart');
const wishlistRoutes = require('../routes/Wishlist');
const orderRoutes = require('../routes/Order');
const paymentMethodRoutes = require('../routes/PaymentMethod');
const paymentRoutes = require("../routes/Payment");

//Route for registering user
router.post('/register', async (req, res) => {
    const { userName, password, email, phoneNum, name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ userName, password: hashedPassword, email, phoneNum, name });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("authToken", token, {
            httpOnly: true, // Prevents JavaScript access
            secure: false, // HTTPS only in production
            sameSite: 'lax',
            maxAge: 3600000, // 1 hour in milliseconds
            path: "/",
        });
        res.status(200).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ ok: false, error: "Error registering user: " + err.message });
    }
});

//Route for user login
router.post('/login', async (req,res)=>{
    const {userName, password} = req.body;
    try{
        const user = await User.findOne({userName});
        if(!user) return res.status(404).send("User not found");
        const isPassMatch = await bcrypt.compare(password, user.password);
        if(!isPassMatch) return res.status(401).send("Invalid credentials!");

        const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1h"});

        res.cookie("authToken", token, {
            httpOnly: true, // Prevents JavaScript access
            secure: false, // HTTPS only in production
            sameSite: 'None',
            maxAge: 3600000, // 1 hour in milliseconds
            path: "/",
        });

        res.status(200).json({ message: "Logged in successfully" });
    }
    catch(err){
        res.status(500).send("Server error: "+ err.message);
    }
});

// Apply token authentication middleware to all /users routes
router.use(authenticateToken);

//Route for getting profile (protected)
router.get('/profile', (req,res)=>{
    res.json({user: req.user});
})

//Route for logout
router.post('/logout', logout);

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
router.use('/order', authenticateToken, orderRoutes);

module.exports = router;