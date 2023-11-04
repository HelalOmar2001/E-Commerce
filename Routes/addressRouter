const express = require("express");
const addressController = require("../Controllers/addressController");
const validators = require("../Utils/Validators/brandValidator");
const authController = require("../Controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("user"),
    addressController.addAddress
  )
  .get(
    authController.protect,
    authController.allowedTo("user"),
    addressController.getLoggedUserAddresses
  );

router
  .route("/:addressId")
  .delete(
    authController.protect,
    authController.allowedTo("user"),
    addressController.removeAddress
  );

module.exports = router;
