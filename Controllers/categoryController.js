const Category = require("../Models/categoryModel");
const handlerFactory = require("./handlerFactory");
const ApiError = require("../Utils/apiError");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

// 1- Disk Storage Engine (for image uploading)
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/categories");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `category-${uuidv4()}-${Date.now()}.${ext}`);
//   },
// });

// 2- Memory Storage Engine (for image processing)
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new ApiError("Not an image! Please upload only images."), false);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadCategoryImage = upload.single("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);

  // Save Image into our DB
  req.body.image = fileName;
  next();
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = handlerFactory.getAll(Category);

//@desc     Get category by id
//@route    GET /api/categories/:id
//@access   Public
exports.getCategory = handlerFactory.getOne(Category);

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = handlerFactory.createOne(Category);

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = handlerFactory.updateOne(Category);

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = handlerFactory.deleteOne(Category);
