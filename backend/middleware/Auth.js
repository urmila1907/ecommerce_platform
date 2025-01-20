const jwt = require('jsonwebtoken');
const blacklistedTokens = [];

function logout(req,res){
    const token = req.cookies.authToken;
    blacklistedTokens.push(token);
    res.send("Logged out!");
}

function authenticateToken(req, res, next) {
    console.log("Cookies in middleware:", req.cookies);
    const token = req.cookies.authToken; 
    if (!token) {
        console.log("Token missing");
        return res.status(401).send("User not authorized");
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