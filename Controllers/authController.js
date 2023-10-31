const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const sendEmail = require("../utils/sendEmail");
const createToken = require("../Utils/createToken");

const User = require("../Models/userModel");

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
  if (!user.active) return next(new ApiError("User is deactivated", 401));
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
  const message = `Hi ${user.name},\n\nYour password reset token is ${resetToken}\n\nThis token is valid for 10 minutes\n\nIf you didn't request this email, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token (valid for 10 minutes)",
      message: message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(
      new ApiError("There was an error sending the email. Try again later", 500)
    );
  }

  res.status(200).json({
    status: "success",
    message: "Token sent to email",
  });
});

// @desc      Verify reset password code
// @route     PATCH /api/v1/auth/verifyResetCode
// @access    Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user by reset token
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) return next(new ApiError("Token is invalid or has expired", 400));

  // 2) Reset Code is valid, so verify it
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Reset code verified",
  });
});

// @desc      Reset password
// @route     PATCH /api/v1/auth/resetPassword
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) return next(new ApiError("There is no user with this email", 404));

  // 2) Check if reset code is verified
  if (!user.passwordResetVerified)
    return next(new ApiError("Please verify your reset code first", 400));

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  // 3) Generate token
  const token = createToken({ userId: user._id });
  res.status(200).json({
    status: "success",
    message: "Password reset successful",
    token,
  });
});
