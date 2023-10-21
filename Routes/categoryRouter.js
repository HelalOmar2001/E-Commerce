const express = require("express");
const categoryController = require("../Controllers/categoryController");
const validators = require("../Utils/Validators/categoryValidator");
const subCategoryRouter = require("./subCategoryRouter");

const router = express.Router();

router.use("/:id/subCategories", subCategoryRouter);

router
  .route("/")
  .get(categoryController.getCategories)
  .post(validators.createCategoryValidator, categoryController.createCategory);

router
  .route("/:id")
  .get(validators.getCategoryValidator, categoryController.getCategory)
  .patch(validators.updateCategoryValidator, categoryController.updateCategory)
  .delete(
    validators.deleteCategoryValidator,
    categoryController.deleteCategory
  );

module.exports = router;
