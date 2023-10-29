const express = require("express");
const userController = require("../Controllers/userController");
const validators = require("../Utils/Validators/userValidator");
const authController = require("../Controllers/authController");

const router = express.Router();

router.patch(
  "/changePassword/:id",
  validators.changeUserPasswordValidator,
  userController.changeUserPassword
);

router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    userController.getUsers
  )
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    userController.uploadUserImage,
    userController.resizeImage,
    validators.createUserValidator,
    userController.createUser
  );

router
  .route("/:id")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    validators.getUserValidator,
    userController.getUser
  )
  .patch(
    authController.protect,
    authController.allowedTo("admin"),
    userController.uploadUserImage,
    userController.resizeImage,
    validators.updateUserValidator,
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    validators.deleteUserValidator,
    userController.deleteUser
  );

module.exports = router;
