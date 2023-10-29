const express = require("express");
const brandController = require("../Controllers/brandController");
const validators = require("../Utils/Validators/brandValidator");
const authController = require("../Controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(brandController.getBrands)
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    brandController.uploadBrandImage,
    brandController.resizeImage,
    validators.createBrandValidator,
    brandController.createBrand
  );

router
  .route("/:id")
  .get(validators.getBrandValidator, brandController.getBrand)
  .patch(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    brandController.uploadBrandImage,
    brandController.resizeImage,
    validators.updateBrandValidator,
    brandController.updateBrand
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    validators.deleteBrandValidator,
    brandController.deleteBrand
  );

module.exports = router;
