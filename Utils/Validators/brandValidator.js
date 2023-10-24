const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validatorMiddleware");
const slugify = require("slugify");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3 })
    .withMessage("Brand name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("Brand name must be less than 32 characters long")
    .isString()
    .withMessage("Brand name must be a string")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID format"),
  check("name").custom((value, { req }) => {
    if (value) req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID format"),
  validatorMiddleware,
];
