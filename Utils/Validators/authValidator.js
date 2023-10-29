const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validatorMiddleware");
const slugify = require("slugify");
const User = require("../../Models/userModel");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters long")
    .isString()
    .withMessage("User name must be a string")
    .custom((value, { req }) => {
      if (value) req.body.slug = slugify(value);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) throw new Error("Email already exists");
    }),
  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Password confirmation does not match");
      return true;
    }),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validatorMiddleware,
];
