const express = require("express");
const authController = require("../Controllers/authController");
const validators = require("../Utils/Validators/authValidator");

const router = express.Router();

router.post("/signup", validators.signUpValidator, authController.signUp);
router.post("/login", validators.loginValidator, authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/verifyResetCode", authController.verifyResetCode);
router.post("/resetPassword", authController.resetPassword);

module.exports = router;
