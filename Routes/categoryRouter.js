const express = require("express");
const categoryController = require("../Controllers/categoryController");
const validators = require("../Utils/Validators/categoryValidator");
const subCategoryRouter = require("./subCategoryRouter");
const authController = require("../Controllers/authController");

const router = express.Router();

router.use("/:id/subCategories", subCategoryRouter);

router
  .route("/")
  .get(categoryController.getCategories)
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    categoryController.uploadCategoryImage,
    categoryController.resizeImage,
    validators.createCategoryValidator,
    categoryController.createCategory
  );

router
  .route("/:id")
  .get(validators.getCategoryValidator, categoryController.getCategory)
  .patch(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    categoryController.uploadCategoryImage,
    categoryController.resizeImage,
    validators.updateCategoryValidator,
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    validators.deleteCategoryValidator,
    categoryController.deleteCategory
  );

module.exports = router;
