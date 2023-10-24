const Product = require("../Models/productModel");
const handlerFactory = require("./handlerFactory");
const {
  uploadMultipleImages,
} = require("../Middlewares/uploadImagesMiddleware");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

exports.uploadProductImages = uploadMultipleImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // 1- Image Processing for ImageCover
  if (req.files.imageCover) {
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFilename}`);
    // Save imageCoverFilename to req.body
    req.body.imageCover = imageCoverFilename;
  }

  // 2- Image Processing for Images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `product-${uuidv4()}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${filename}`);
        req.body.images.push(filename);
      })
    );
  }
  next();
});

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
