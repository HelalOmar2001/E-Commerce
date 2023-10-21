const Brand = require("../Models/brandModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../Utils/apiError");

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  const brands = await Brand.find().skip(skip).limit(limit);
  res.status(200).json({
    status: "success",
    results: brands.length,
    page: page,
    limit: limit,
    data: {
      brands,
    },
  });
});

//@desc     Get brand by id
//@route    GET /api/brands/:id
//@access   Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return next(new ApiError("Category not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      brand,
    },
  });
});

// @desc    Create new brand
// @route   POST /api/brands
// @access  Private/Admin
exports.createBrand = asyncHandler(async (req, res) => {
  const newBrand = await Brand.create({
    name: req.body.name,
    slug: slugify(req.body.name),
  });
  res.status(201).json({
    status: "success",
    message: "Create new Brand",
    data: {
      newBrand,
    },
  });
});

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, slug: slugify(req.body.name) },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!brand) {
    return next(new ApiError("Brand not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Update Brand",
    data: {
      brand,
    },
  });
});

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) {
    return next(new ApiError("Brand not found", 404));
  }
  res.status(204).send();
});
