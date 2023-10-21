const express = require("express");
const brandController = require("../Controllers/brandController");
const validators = require("../Utils/Validators/brandValidator");

const router = express.Router();

router
  .route("/")
  .get(brandController.getBrands)
  .post(validators.createBrandValidator, brandController.createBrand);

router
  .route("/:id")
  .get(validators.getBrandValidator, brandController.getBrand)
  .patch(validators.updateBrandValidator, brandController.updateBrand)
  .delete(validators.deleteBrandValidator, brandController.deleteBrand);

module.exports = router;
