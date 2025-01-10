const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require("./routes/User");
const productRoutes = require("./routes/Product");
const orderRoutes = require("./routes/Order");

dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("Connected to database"))
.catch((err)=> console.error("Database connection error: ", err));

const port = process.env.PORT || 3000;
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/order', orderRoutes);

app.listen(port, ()=>{
    console.log(`Listening at port ${port}`);
})