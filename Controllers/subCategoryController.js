const SubCategory = require("../Models/subCategoryModel");
const handlerFactory = require("./handlerFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.id;
  next();
};

exports.createFilterObj = (req, res, next) => {
  if (req.params.id) req.filterObj = { category: req.params.id };
  next();
};

// @desc    Create a subCategory
// @route   POST /api/subCategories
// @access  Private/Admin
exports.createSubCategory = handlerFactory.createOne(SubCategory);

// @desc    Get all subCategories
// @route   GET /api/subCategor
// @access  Public
exports.getSubCategories = handlerFactory.getAll(SubCategory);

// @desc    Get subCategory by id
// @route   GET /api/subCategories/:id
// @access  Public
exports.getSubCategory = handlerFactory.getOne(SubCategory);

// @desc    Update subCategory
// @route   PUT /api/subCategories/:id
// @access  Private/Admin
exports.updateSubCategory = handlerFactory.updateOne(SubCategory);

// @desc    Delete subCategory
// @route   DELETE /api/subCategories/:id
// @access  Private/Admin
exports.deleteSubCategory = handlerFactory.deleteOne(SubCategory);
