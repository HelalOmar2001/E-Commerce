const express = require("express");
const reviewController = require("../Controllers/reviewController");
const validators = require("../Utils/Validators/reviewValidator");
const authController = require("../Controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.createFilterObj, reviewController.getReviews)
  .post(
    authController.protect,
    authController.allowedTo("user"),
    reviewController.setProductIdToBody,
    validators.createReviewValidator,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.protect,
    authController.allowedTo("user"),
    validators.updateReviewValidator,
    reviewController.updateReview
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin", "manager", "user"),
    validators.deleteReviewValidator,
    reviewController.deleteReview
  );

module.exports = router;
