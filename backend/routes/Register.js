const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../models/User");

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
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'lax',
            maxAge: 3600000, // 1 hour in milliseconds
            path: "/",
        });
        res.status(200).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ ok: false, error: "Error registering user: " + err.message });
    }
});

module.exports = router;