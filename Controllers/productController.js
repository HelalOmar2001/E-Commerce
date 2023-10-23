const Product = require("../Models/productModel");
const handlerFactory = require("./handlerFactory");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = handlerFactory.getAll(Product);

//@desc     Get product by id
//@route    GET /api/products/:id
//@access   Public
exports.getProduct = handlerFactory.getOne(Product);

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = handlerFactory.createOne(Product);

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = handlerFactory.updateOne(Product);

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = handlerFactory.deleteOne(Product);
