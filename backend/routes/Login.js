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
        if(!user) return res.status(404).json({msg: "User not found"});
        const isPassMatch = await bcrypt.compare(password, user.password);
        if(!isPassMatch) return res.status(401).json({msg: "Invalid credentials!"});

        const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1h"});
        const refreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

        res.cookie("authToken", token, {
            httpOnly: true, // Prevents JavaScript access
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'lax',
            maxAge: 3600000, // 1 hour in milliseconds
            path: "/",
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 604800000, // 7 days
            path: "/",
        });

        res.status(200).json({ message: "Logged in successfully"});
    }
    catch(err){
        res.status(500).json({message: "Server error: "+ err.message});
    }
});

module.exports = router;