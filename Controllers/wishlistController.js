const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/ApiError");
const User = require("../Models/userModel");

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist
// @access  Private/User
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  //$addToSet adds & prevents duplicate entries in the wishlist array
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product added to wishlist",
    data: user.wishlist,
  });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Private/User
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  //$pull removes the product from the wishlist array
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product removed from wishlist",
    data: user.wishlist,
  });
});

// @desc    Get logged in user's wishlist
// @route   GET /api/v1/wishlist
// @access  Private/User
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
