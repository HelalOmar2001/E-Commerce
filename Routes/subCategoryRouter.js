const subCategoryController = require("../Controllers/subCategoryController");
const subCategoryValidator = require("../Utils/Validators/subCategoryValidator");
const express = require("express");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    subCategoryController.createFilterObj,
    subCategoryController.getSubCategories
  )
  .post(
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
    subCategoryValidator.updateSubCategoryValidator,
    subCategoryController.updateSubCategory
  )
  .delete(
    subCategoryValidator.deleteSubCategoryValidator,
    subCategoryController.deleteSubCategory
  );

module.exports = router;
