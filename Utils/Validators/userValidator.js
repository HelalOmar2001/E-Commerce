const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validatorMiddleware");
const slugify = require("slugify");
const User = require("../../Models/userModel");
const bcrypt = require("bcryptjs");

exports.createUserValidator = [
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
  check("profileImg").optional(),
  check("phone")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number format"),
  check("role").optional(),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),
  check("name")
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
  check("profileImg").optional(),
  check("phone")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number format"),
  check("role").optional(),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  check("password")
    .notEmpty()
    .withMessage("New password is required")
    .custom(async (value, { req }) => {
      // 1) verify that current password is correct
      const user = await User.findById(req.params.id);
      if (!user) throw new Error("There is no user with this ID");
      const isPasswordCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isPasswordCorrect) throw new Error("Incorrect password");

      // 2) verify password confirmation
      if (value !== req.body.passwordConfirm)
        throw new Error("Password confirmation does not match");
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("New password confirmation is required"),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("name")
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
  check("phone")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number format"),
  validatorMiddleware,
];
