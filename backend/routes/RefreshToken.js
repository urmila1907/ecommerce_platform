const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing' });
    }

    // Split the Authorization header into "Bearer <token>"
    const refreshToken = authHeader.split(' ')[1];
    if (!refreshToken) {
        return res.status(400).json({ error: 'User not authorized' });
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        const newAccessToken = jwt.sign({ id: payload.id, role: payload.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" });
        
        const newRefreshToken = jwt.sign({ id: payload.id, role: payload.role }, 
            process.env.REFRESH_SECRET, 
            { expiresIn: "7d" });
    
        res.cookie("authToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 3600000, // 1 hour,
            path: "/",
        });
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 604800000, // 1 hour,
            path: "/"
        });
        res.status(200).json({ message: "New token issued", token: newAccessToken});
    } catch (err) {
        res.status(403).json({msg: "Invalid refresh token"});
    }
});

module.exports = router;