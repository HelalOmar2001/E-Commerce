const express = require("express");
const wishlistController = require("../Controllers/wishlistController");
const validators = require("../Utils/Validators/brandValidator");
const authController = require("../Controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("user"),
    wishlistController.addToWishlist
  )
  .get(
    authController.protect,
    authController.allowedTo("user"),
    wishlistController.getLoggedUserWishlist
  );

router
  .route("/:productId")
  .delete(
    authController.protect,
    authController.allowedTo("user"),
    wishlistController.removeFromWishlist
  );

module.exports = router;
