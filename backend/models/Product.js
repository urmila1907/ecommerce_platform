const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    description: {type: String, default: "Product"}
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;