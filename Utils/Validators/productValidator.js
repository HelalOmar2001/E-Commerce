const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validatorMiddleware");
const Category = require("../../Models/categoryModel");
const SubCategory = require("../../Models/subCategoryModel");
const slugify = require("slugify");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Product title must be at least 3 characters long")
    .notEmpty()
    .withMessage("Product title is required")
    .custom((value, { req }) => {
      if (value) req.body.slug = slugify(value);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Product description must be at most 2000 characters long"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Product price must be at most 32 characters long"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product price after discount must be a number")
    .custom((value, { req }) => {
      if (value > req.body.price) {
        throw new Error(
          "Product price after discount must be less than product price"
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Product colors must be an array"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must be an array"),
  check("imageCover").notEmpty().withMessage("Product image cover is required"),
  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .custom(async (value) => {
      if (!(await Category.findById(value))) {
        throw new Error("Category not found");
      }
      return true;
    }),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid subCategory ID format")
    .custom(async (value) => {
      const subCategories = await SubCategory.find({
        _id: { $in: value, $exists: true },
      });
      if (value.length !== subCategories.length || subCategories.length < 1) {
        throw new Error("SubCategory not found");
      }
      return true;
    })
    .custom(async (value, { req }) => {
      const subCategories = await SubCategory.find({
        category: req.body.category,
      });

      // Get subCategories IDs
      const subCategoriesIds = subCategories.map((subCategory) =>
        subCategory._id.toString()
      );

      // Check if subCategories IDs are included in subCategories IDs
      const checker = value.every((subCategory) =>
        subCategoriesIds.includes(subCategory)
      );
      if (!checker) {
        throw new Error("SubCategory not found in this category");
      }
      return true;
    }),
  check("brands").optional().isMongoId().withMessage("Invalid brand ID format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product ratings average must be a number")
    .isLength({ min: 1 })
    .withMessage("Product ratings average must be at least 1")
    .isLength({ max: 5 })
    .withMessage("Product ratings average must be at most 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratings quantity must be a number"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID format"),
  check("title")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID format"),
  validatorMiddleware,
];
