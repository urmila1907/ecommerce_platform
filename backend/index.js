require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require("./routes/User");
const productRoutes = require("./routes/Product");
const cors = require('cors');

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("Missing Razorpay environment variables");
    process.exit(1);
}


mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("Connected to database"))
.catch((err)=> console.error("Database connection error: ", err));

const port = process.env.PORT || 3000;
app.use('/user', userRoutes);
app.use('/product', productRoutes);

app.listen(port, ()=>{
    console.log(`Listening at port ${port}`);
})