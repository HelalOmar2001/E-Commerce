const Review = require("../Models/reviewModel");
const handlerFactory = require("./handlerFactory");

const asyncHandler = require("express-async-handler");

// nested route for product review
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// nested route for product review
exports.createFilterObj = (req, res, next) => {
  if (req.params.productId) req.filterObj = { product: req.params.productId };
  next();
};

// @desc    Get all review
// @route   GET /api/reviews
// @access  Public
exports.getReviews = handlerFactory.getAll(Review);

//@desc     Get review by id
//@route    GET /api/reviews/:id
//@access   Public
exports.getReview = handlerFactory.getOne(Review);

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private/protect/Admin
exports.createReview = handlerFactory.createOne(Review);

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private/protect/User
exports.updateReview = handlerFactory.updateOne(Review);

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/protect/User-Admin-Manager
exports.deleteReview = handlerFactory.deleteOne(Review);
