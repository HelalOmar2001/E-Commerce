const Brand = require("../Models/brandModel");
const handlerFactory = require("./handlerFactory");
const { uploadSingleImage } = require("../Middlewares/uploadImagesMiddleware");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

exports.uploadBrandImage = uploadSingleImage("image");

// Image Processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);

  // Save Image into our DB
  req.body.image = fileName;
  next();
});

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = handlerFactory.getAll(Brand);

//@desc     Get brand by id
//@route    GET /api/v1/brands/:id
//@access   Public
exports.getBrand = handlerFactory.getOne(Brand);

// @desc    Create new brand
// @route   POST /api/v1/brands
// @access  Private/Admin
exports.createBrand = handlerFactory.createOne(Brand);

// @desc    Update brand
// @route   PUT /api/v1/brands/:id
// @access  Private/Admin
exports.updateBrand = handlerFactory.updateOne(Brand);

// @desc    Delete brand
// @route   DELETE /api/v1/brands/:id
// @access  Private/Admin
exports.deleteBrand = handlerFactory.deleteOne(Brand);
