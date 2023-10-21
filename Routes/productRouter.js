const express = require("express");
const productController = require("../Controllers/productController");
const validators = require("../Utils/Validators/productValidator");

const router = express.Router();

router
  .route("/")
  .get(productController.getProducts)
  .post(validators.createProductValidator, productController.createProduct);

router
  .route("/:id")
  .get(validators.getProductValidator, productController.getProduct)
  .patch(validators.updateProductValidator, productController.updateProduct)
  .delete(validators.deleteProductValidator, productController.deleteProduct);

module.exports = router;
