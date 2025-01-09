const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{type: String, required: true},
    userName: {type: String, required: true, unique: true, minLength: 5},
    password: {type: String, required: true},
    role: {type: String, default: "User"},
    age: {type: Number},
    phoneNum: {type: Number, length: 10}
})

const User = mongoose.model("User", userSchema);

module.exports = User;