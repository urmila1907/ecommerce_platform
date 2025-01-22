const jwt = require('jsonwebtoken');

function logout(req,res){
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });
    res.status(200).json({ message: "Logged out successfully" });
}

function authenticateToken(req, res, next) {
    // Check if Authorization header is present
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing' });
    }

    // Split the Authorization header into "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(400).json({ error: 'User not authorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        return res.status(401).send("Unauthorized: Invalid token");
    }
}

module.exports = {authenticateToken, logout};