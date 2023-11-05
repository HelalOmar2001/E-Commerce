const express = require("express");
const cartController = require("../Controllers/cartController");
const validators = require("../Utils/Validators/brandValidator");
const authController = require("../Controllers/authController");

const router = express.Router();

router.use(authController.protect, authController.allowedTo("user"));

router
  .route("/")
  .post(cartController.addItemToCart)
  .get(cartController.getCart)
  .delete(cartController.clearCart);

router.patch("/applyCoupon", cartController.applyCoupon);

router
  .route("/:itemId")
  .delete(cartController.deleteItemFromCart)
  .patch(cartController.updateCartItemQuantity);
module.exports = router;
