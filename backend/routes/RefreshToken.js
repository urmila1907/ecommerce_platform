const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/refresh-token', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).send("Refresh token not found");

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const newAccessToken = jwt.sign({ id: payload.id, role: payload.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("authToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000, // 1 hour
        });

        res.status(200).json({ message: "New token issued" });
    } catch (err) {
        res.status(403).send("Invalid refresh token");
    }
});

module.exports = router;