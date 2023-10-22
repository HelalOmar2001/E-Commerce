const Product = require("../Models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../Utils/apiError");
const ApiFeatures = require("../Utils/apiFeatures");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  // Build query
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // Execute query
  const products = await apiFeatures.mongooseQuery;
  console.log({ status: 1, products });
  // Send response
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
  console.log(req.query);
  // 1) Filtering
  // const queryStringObj = { ...req.query };
  // const execludedFields = ["page", "sort", "limit", "fields"];
  // execludedFields.forEach((el) => delete queryStringObj[el]);

  // Apply advanced filtering (gte, gt, lte, lt)
  // let queryStr = JSON.stringify(queryStringObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // 2) Pagination
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 10;
  // const skip = (page - 1) * limit;

  // 3) Build query
  // let mongooseQuery = Product.find(JSON.parse(queryStr))
  //   .skip(skip)
  //   .limit(limit)
  //   .populate("category");

  // 3.1) Sorting
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   mongooseQuery = mongooseQuery.sort(sortBy);
  // } else {
  //   mongooseQuery = mongooseQuery.sort("-createdAt");
  // }

  // 3.2) Field limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(",").join(" ");
  //   mongooseQuery = mongooseQuery.select(fields);
  // } else {
  //   mongooseQuery = mongooseQuery.select("-__v");
  // }

  // 3.3) Search
  // ToDo : check why searching function is not working
  // if (req.query.keyword) {
  //   const query = {};
  //   query.$or = [
  //     { title: { $regex: req.query.keyword, $options: "i" } },
  //     { description: { $regex: req.query.keyword, $options: "i" } },
  //   ];
  //   mongooseQuery = mongooseQuery.find(query);
  // }
});

//@desc     Get product by id
//@route    GET /api/products/:id
//@access   Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);

  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Create new Product",
    data: {
      product: newProduct,
    },
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  if (req.body.title) req.body.slug = slugify(req.body.title);
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Update Product",
    data: {
      product,
    },
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  res.status(204).send();
});
