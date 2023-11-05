const handlerFactory = require("./handlerFactory");

const Coupon = require("../Models/couponModel");

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  private/admin-manager
exports.getAllCoupons = handlerFactory.getAll(Coupon);

//@desc     Get coupon by id
//@route    GET /api/v1/coupons/:id
//@access   private/admin-manager
exports.getCoupon = handlerFactory.getOne(Coupon);

// @desc    Create new coupon
// @route   POST /api/v1/coupons
// @access  Private/Admin-manager
exports.createCoupon = handlerFactory.createOne(Coupon);

// @desc    Update coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private/Admin-manager
exports.updateCoupon = handlerFactory.updateOne(Coupon);

// @desc    Delete brand
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = handlerFactory.deleteOne(Coupon);
