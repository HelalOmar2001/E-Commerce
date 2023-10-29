const subCategoryController = require("../Controllers/subCategoryController");
const subCategoryValidator = require("../Utils/Validators/subCategoryValidator");
const express = require("express");
const authController = require("../Controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    subCategoryController.createFilterObj,
    subCategoryController.getSubCategories
  )
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    subCategoryController.setCategoryIdToBody,
    subCategoryValidator.createSubCategoryValidator,
    subCategoryController.createSubCategory
  );

router
  .route("/:id")
  .get(
    subCategoryValidator.getCategoryValidator,
    subCategoryController.getSubCategory
  )
  .patch(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    subCategoryValidator.updateSubCategoryValidator,
    subCategoryController.updateSubCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    subCategoryValidator.deleteSubCategoryValidator,
    subCategoryController.deleteSubCategory
  );

module.exports = router;
