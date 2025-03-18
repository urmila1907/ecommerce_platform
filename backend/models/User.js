const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: true
        },
    userName: {
        type: String, 
        required: true, 
        unique: true, 
        minLength: 5
        },
    password: {
        type: String, 
        required: true
        },
    role: {
        type: String, 
        default: "User"
        },
    phoneNum: {
        type: Number, 
        length: 10,
        required: true, 
        unique: true,
        },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
        },
    address: [{
        type: Schema.Types.ObjectId,
        ref: 'Address',
        }]
})

const User = mongoose.model("User", userSchema);

module.exports = User;