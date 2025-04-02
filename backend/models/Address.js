const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
        },
    fullName: {
        type: String, 
        required: true,
        },
    addressLine1: {
        type: String, 
        required: true
        },
    addressLine2: {
        type: String, 
        },
    phoneNum: {
        type: Number, 
        length: 10,
        required: true, 
        },
    city: {
        type: String,
        required: true,
        },
    state: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
        default: "India"
    },
    addressType: {
        type: String,
        enum: ["Home", "Work", "Other"],
        default: "Home"
    },
    isDefault: {
        type: Boolean,
        default: false
    }
})

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;