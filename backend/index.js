require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/User");
const productRoutes = require("./routes/Product");
const loginRoute = require("./routes/Login");
const registerRoute = require("./routes/Register");
const refreshTokenRoute = require("./routes/RefreshToken");

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true,
}));

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("Missing Razorpay environment variables");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("Connected to database"))
.catch((err)=> console.error("Database connection error: ", err));

const port = process.env.PORT || 8000;

app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/refresh-token', refreshTokenRoute);
app.use('/user', userRoutes);
app.use('/product', productRoutes);

app.listen(port, ()=>{
    console.log(`Listening at port ${port}`);
});

// Handle process termination to close server properly
process.on("SIGTERM", () => {
    server.close(() => {
        process.exit(0);
    });
});

process.on("SIGINT", () => {
    server.close(() => {
        process.exit(0);
    });
});