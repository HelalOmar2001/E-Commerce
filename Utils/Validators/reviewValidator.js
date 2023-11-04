const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validatorMiddleware");
const Review = require("../../Models/reviewModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review ID format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Ratings value is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 and 5"),
  check("user")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID format")
    .custom(async (value, { req }) => {
      // check if logged user created review for this product before
      const review = await Review.findOne({
        user: req.user._id,
        product: req.body.product,
      });
      if (review) throw new Error("You already reviewed this product");
      return true;
    }),
  check("product")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID format"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID format")
    .custom(async (value, { req }) => {
      // check if logged user created review for this product before
      const review = await Review.findById(value);
      if (!review) throw new Error("This review does not exist");
      if (review.user._id.toString() !== req.user._id.toString())
        throw new Error("You are not allowed to update this review");
      return true;
    }),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID format")
    .custom(async (value, { req }) => {
      // check if logged user created review for this product before
      if (req.user.role === "user") {
        const review = await Review.findById(value);
        if (!review) throw new Error("This review does not exist");
        if (review.user._id.toString() !== req.user._id.toString())
          throw new Error("You are not allowed to delete this review");
      }
      return true;
    }),
  validatorMiddleware,
];
