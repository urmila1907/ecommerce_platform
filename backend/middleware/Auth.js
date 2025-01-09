const jwt = require('jsonwebtoken');
const blacklistedTokens = [];

function logout(req,res){
    const token = req.headers['authorization'].split(" ")[1];
    blacklistedTokens.push(token);
    res.send("Logged out!");
}

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send("Access denied!");
    }
    const token = authHeader.split(" ")[1];
    if(blacklistedTokens.includes(token)) {
        return res.status(403).send("Token is invalidated.");
    }
    jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
        if(err) return res.status(403).send("Token Invalid!");
        req.user = user;
        next();
    })
}


module.exports = {authenticateToken, logout};