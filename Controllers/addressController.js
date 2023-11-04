const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/ApiError");
const User = require("../Models/userModel");

// @desc    Add address to user's addresses
// @route   POST /api/v1/addresses
// @access  Private/User
exports.addAddress = asyncHandler(async (req, res, next) => {
  //$addToSet adds & prevents duplicate entries in the addresses array
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address added successfully",
    data: user.addresses,
  });
});

// @desc    Remove address from user's addresses
// @route   DELETE /api/v1/addresses/:addressId
// @access  Private/User
exports.removeAddress = asyncHandler(async (req, res, next) => {
  //$pull removes the address from the addresses array
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address removed successfully",
    data: user.addresses,
  });
});

// @desc    Get logged in user's addresses
// @route   GET /api/v1/addresses
// @access  Private/User
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});
