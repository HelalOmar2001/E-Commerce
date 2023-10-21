const Category = require("../Models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../Utils/apiError");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  const categories = await Category.find().skip(skip).limit(limit);
  res.status(200).json({
    status: "success",
    results: categories.length,
    page: page,
    limit: limit,
    data: {
      categories,
    },
  });
});

//@desc     Get category by id
//@route    GET /api/categories/:id
//@access   Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new ApiError("Category not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res) => {
  const newCategory = await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name),
  });
  res.status(201).json({
    status: "success",
    message: "Create new category",
    data: {
      category: newCategory,
    },
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, slug: slugify(req.body.name) },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!category) {
    return next(new ApiError("Category not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Update category",
    data: {
      category,
    },
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new ApiError("Category not found", 404));
  }
  res.status(204).send();
});
