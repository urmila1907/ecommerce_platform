const express = require('express');
const router = express.Router();
const Order = require("../models/Order");
const { authenticateToken } = require('../middleware/Auth');

//Route for placing an order
router.post('/place-order', authenticateToken, (req,res)=>{
    
})

module.exports = router;