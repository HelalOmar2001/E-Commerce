const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

const User = require("../Models/userModel");

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc      Sign up user
// @route     POST /api/v1/auth/signup
// @access    Public
exports.signUp = asyncHandler(async (req, res, next) => {
  // 1) Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // 2) Generate token
  const token = createToken({ userId: user._id });
  // 3) Send response
  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

// @desc      Log in user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) Check if email and password exist in body (validation)
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ApiError("Please provide email and password", 400));
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new ApiError("Incorrect email or password", 401));
  // 3) Generate token
  const token = createToken({ userId: user._id });
  // 4) Send response
  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

// @desc      Protect routes from unauthorized access
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exists
  let token;
  if (req.headers.authorization?.startsWith("Bearer"))
    token = req.headers.authorization.split(" ")[1];
  else return next(new ApiError("You are not logged in", 401));
  // 2) Verify token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  console.log(decoded);
  // 3) Check if user still exists
  const user = await User.findById(decoded.userId);
  if (!user) return next(new ApiError("User no longer exists", 401));
  // 4) Check if user changed password after the token was issued
  if (user.passwordChangedAt) {
    const changedAt = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
    if (decoded.iat < changedAt)
      return next(
        new ApiError("Password was changed recently. Please log in again", 401)
      );
  }
  // 5) Grant access to protected route
  req.user = user;
  next();
});

// @desc      Check if user is allowed to perform an action
exports.allowedTo = (...roles) => {
  return asyncHandler((req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new ApiError("You are not allowed to perform this action", 403)
      );
    next();
  });
};

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotPassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ApiError("There is no user with this email", 404));
  // 2) If user exists, generate & hash 6 digits reset token and save it to DB
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetToken = hashedResetToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();
  // 3) Send email with reset token
});
