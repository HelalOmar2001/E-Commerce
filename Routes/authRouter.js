const express = require("express");
const authController = require("../Controllers/authController");
const validators = require("../Utils/Validators/authValidator");

const router = express.Router();

router.route("/signup").post(validators.signUpValidator, authController.signUp);
router.route("/login").post(validators.loginValidator, authController.login);
router.post("/forgotPassword", authController.forgotPassword);

module.exports = router;
