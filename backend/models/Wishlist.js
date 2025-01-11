const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new mongoose.Schema({
    products:[{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalNoOfProducts: {
        type: Number, // Automatically updated based on products.length
        default: 0,
    }, 
    customer:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;