const express = require("express");
const productController = require("../Controllers/productController");
const validators = require("../Utils/Validators/productValidator");
const authController = require("../Controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(productController.getProducts)
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    productController.uploadProductImages,
    productController.resizeProductImages,
    validators.createProductValidator,
    productController.createProduct
  );

router
  .route("/:id")
  .get(validators.getProductValidator, productController.getProduct)
  .patch(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    productController.uploadProductImages,
    productController.resizeProductImages,
    validators.updateProductValidator,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    validators.deleteProductValidator,
    productController.deleteProduct
  );

module.exports = router;
