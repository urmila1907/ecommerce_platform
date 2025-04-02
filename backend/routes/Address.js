const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const asyncHandler = require("../middleware/AsyncHandler");
const Address = require("../models/Address");
const User = require("../models/User");

//Route for getting all address details for a user
router.get("/", asyncHandler(async (req,res) => {
    const addressDetails = await User.findById({_id: req.user.id}).populate('address');
    return res.status(200).json({address: addressDetails.address});
}));

//Route for getting default address details for a user
router.get("/default", asyncHandler(async (req,res) => {
    const addressDetails = await Address.find({userId: req.user.id, isDefault: true});
    if(!addressDetails){
        return res.status(200).json({msg: "No default address is present for this user!"});
    }
    return res.status(200).json({addressDetails});
}));

//Route for getting other address details for a user
router.get("/other", asyncHandler(async (req,res) => {
    const addressDetails = await Address.find({userId: req.user.id, isDefault: false});
    if(!addressDetails){
        return res.status(200).json({msg: "No other address is present for this user!"});
    }
    return res.status(200).json({addressDetails});
}));

//Route for editing address details for a user
router.put("/:id", asyncHandler(async (req,res) => {
    const addressId = req.params.id;
    const newAddress = req.body;
    const addressDetails = await Address.findByIdAndUpdate(addressId, newAddress, { new: true, runValidators: true });
    if(!addressDetails){
        return res.status(404).json({msg: "No such address is present for this user!"});
    }
    return res.status(200).json({msg: "Address updated successfully!"});
}));

//Route for removing address details for a user
router.delete("/:id", asyncHandler(async (req,res) => {
    const addressId = req.params.id;
    const addressDetails = await Address.findByIdAndDelete(addressId);
    if(!addressDetails){
        return res.status(404).json({msg: "No such address is present for this user!"});
    }
    const userAddress = await User.findByIdAndUpdate({_id: req.user.id},{$pull: {address: addressDetails._id}},{new: true, runValidators: true} );
    return res.status(200).json({msg: "Address removed successfully!"});
}));

//Route for adding address details for a user
router.post("/", asyncHandler(async (req,res) => {
    const newAddress = req.body;
    const addDetails = {
        userId: req.user.id,
        fullName: newAddress.fullName,
        addressLine1: newAddress.addressLine1,
        phoneNum: newAddress.phoneNum,
        postalCode: newAddress.postalCode,
        city: newAddress.city,
        state: newAddress.state,
        country: newAddress.country,
        isDefault: newAddress.isDefault
    }
    const addressDetails = new Address(addDetails);
    await addressDetails.save();
    const userAddress = await User.findByIdAndUpdate({_id: req.user.id},{$push: {address: addressDetails._id}},{new: true, runValidators: true} );
    return res.status(201).json({msg: "Address added successfully!"});
}));

module.exports = router;