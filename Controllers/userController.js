const User = require("../Models/userModel");
const handlerFactory = require("./handlerFactory");
const { uploadSingleImage } = require("../Middlewares/uploadImagesMiddleware");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const ApiError = require("../Utils/apiError");
const bcrypt = require("bcryptjs");
const createToken = require("../Utils/createToken");
// Image Upload
exports.uploadUserImage = uploadSingleImage("profileImg");

// Image Processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (!req.file) return next();
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${fileName}`);

  // Save Image into our DB
  req.body.profileImg = fileName;
  next();
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = handlerFactory.getAll(User);

//@desc     Get user by id
//@route    GET /api/users/:id
//@access   Private/Admin
exports.getUser = handlerFactory.getOne(User);

// @desc    Create new user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = handlerFactory.createOne(User);

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      runValidators: true,
      new: true,
    }
  );

  if (!user) return next(new ApiError("User not found", 404));

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      runValidators: true,
      new: true,
    }
  );
  if (!user) return next(new ApiError("User not found", 404));
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = handlerFactory.deleteOne(User);

//@desc     Get logged user data
//@route    GET /api/users/getMe
//@access   Private
exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

//@desc     Update logged user password
//@route    PATCH /api/users/updateMyPassword
//@access   Private
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update password based on current logged user
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      runValidators: true,
      new: true,
    }
  );

  // 2) Generate token
  const token = createToken({ userId: user._id });

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

//@desc     Update logged user data (without password, role)
//@route    PATCH /api/users/updateMe
//@access   Private
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

//@desc     Deactivate logged user
//@route    DELETE /api/users/deactivateMe
//@access   Private
exports.deactivateLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).send();
});
