const slugify = require("slugify");
const SubCategory = require("../Models/subCategoryModel");
const apiError = require("../Utils/apiError");
const asyncHandler = require("express-async-handler");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.id;
  next();
};

// @desc    Create a subCategory
// @route   POST /api/subCategories
// @access  Private/Admin
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;

  const subCategory = await SubCategory.create({
    name,
    category,
    slug: slugify(name),
  });

  res.status(201).json({
    success: true,
    data: await subCategory.populate("category", "name slug"),
  });
});

// @desc    Get all subCategories
// @route   GET /api/subCategor
// @access  Public
exports.getSubCategories = asyncHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  let filterObj = {};
  if (req.params.id) filterObj = { category: req.params.id };
  const subCategories = await SubCategory.find(filterObj)
    .skip(skip)
    .limit(limit)
    .populate("category", "name slug -_id");
  res.status(200).json({
    success: true,
    results: subCategories.length,
    data: subCategories,
  });
});

// @desc    Get subCategory by id
// @route   GET /api/subCategories/:id
// @access  Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findById(req.params.id).populate(
    "category",
    "name slug -_id"
  );

  if (!subCategory) {
    return next(new apiError("SubCategory not found", 404));
  }

  res.status(200).json({
    success: true,
    data: subCategory,
  });
});

// @desc    Update subCategory
// @route   PUT /api/subCategories/:id
// @access  Private/Admin
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: slugify(req.body.name),
      category: req.body.category,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!subCategory) {
    return next(new apiError("SubCategory not found", 404));
  }

  res.status(200).json({
    success: true,
    data: subCategory,
  });
});

// @desc    Delete subCategory
// @route   DELETE /api/subCategories/:id
// @access  Private/Admin
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findByIdAndDelete(req.params.id);

  if (!subCategory) {
    return next(new apiError("SubCategory not found", 404));
  }

  res.status(204).send();
});
