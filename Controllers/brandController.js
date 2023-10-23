const Brand = require("../Models/brandModel");
const handlerFactory = require("./handlerFactory");

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
exports.getBrands = handlerFactory.getAll(Brand);

//@desc     Get brand by id
//@route    GET /api/brands/:id
//@access   Public
exports.getBrand = handlerFactory.getOne(Brand);

// @desc    Create new brand
// @route   POST /api/brands
// @access  Private/Admin
exports.createBrand = handlerFactory.createOne(Brand);

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
exports.updateBrand = handlerFactory.updateOne(Brand);

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
exports.deleteBrand = handlerFactory.deleteOne(Brand);
