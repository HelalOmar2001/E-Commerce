const express = require("express");
const userController = require("../Controllers/userController");
const validators = require("../Utils/Validators/userValidator");

const router = express.Router();

router.patch(
  "/changePassword/:id",
  validators.changeUserPasswordValidator,
  userController.changeUserPassword
);

router
  .route("/")
  .get(userController.getUsers)
  .post(
    userController.uploadUserImage,
    userController.resizeImage,
    validators.createUserValidator,
    userController.createUser
  );

router
  .route("/:id")
  .get(validators.getUserValidator, userController.getUser)
  .patch(
    userController.uploadUserImage,
    userController.resizeImage,
    validators.updateUserValidator,
    userController.updateUser
  )
  .delete(validators.deleteUserValidator, userController.deleteUser);

module.exports = router;
