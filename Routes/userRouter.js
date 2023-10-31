const express = require("express");
const userController = require("../Controllers/userController");
const validators = require("../Utils/Validators/userValidator");
const authController = require("../Controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get("/getMe", userController.getLoggedUser, userController.getUser);

router.patch("/updateMyPassword", userController.updateLoggedUserPassword);

router.patch(
  "/updateMe",
  validators.updateLoggedUserValidator,
  userController.updateLoggedUserData
);

router.delete("/deactivateMe", userController.deactivateLoggedUser);

router.use(authController.allowedTo("admin"));

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
