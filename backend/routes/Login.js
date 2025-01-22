const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../models/User");

//Route for user login
router.post('/', async (req,res)=>{
    const {userName, password} = req.body;
    try{
        const user = await User.findOne({userName});
        if(!user) return res.status(404).send("User not found");
        const isPassMatch = await bcrypt.compare(password, user.password);
        if(!isPassMatch) return res.status(401).send("Invalid credentials!");

        const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1h"});

        res.cookie("authToken", token, {
            httpOnly: true, // Prevents JavaScript access
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'lax',
            maxAge: 3600000, // 1 hour in milliseconds
            path: "/",
        });
        
        res.status(200).json({ message: "Logged in successfully", token: token});
    }
    catch(err){
        res.status(500).send("Server error: "+ err.message);
    }
});

module.exports = router;