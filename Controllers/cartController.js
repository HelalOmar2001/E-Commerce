const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

const Cart = require("../Models/cartModel");
const Coupon = require("../Models/couponModel");
const Product = require("../Models/productModel");

const calcTotalCartPrice = (items) => {
  let totalCartPrice = 0;
  items.forEach((item) => {
    totalCartPrice += item.price * item.quantity;
  });
  return totalCartPrice;
};

// @desc    Add item to cart
// @route   POST /api/v1/cart
// @access  Private/user
exports.addItemToCart = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.body.product);
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create new cart
    cart = await Cart.create({
      user: req.user._id,
      items: [
        {
          product: req.body.product,
          color: req.body.color,
          price: product.price,
        },
      ],
    });
  } else {
    // Cart exists
    const productExists = cart.items.findIndex(
      (item) => item.product == req.body.product && item.color == req.body.color
    );

    if (productExists > -1) {
      // product exists in cart, update quantity
      const cartItem = cart.items[productExists];
      cartItem.quantity += 1;
      cart.items[productExists] = cartItem;
    }
    // product does not exist in cart, add new item
    else {
      cart.items.push({
        product: req.body.product,
        color: req.body.color,
        price: product.price,
      });
    }
  }

  // Calculate total cart price
  cart.totalCartPrice = calcTotalCartPrice(cart.items);
  cart.totalPriceAfterDiscount = undefined;
  await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

// @desc    Get logged in user's cart
// @route   GET /api/v1/cart
// @access  Private/user
exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "items.product",
    select: "name price",
  });

  if (!cart) {
    return next(new ApiError("There is no cart for this user", 404));
  }

  cart.totalPriceAfterDiscount = undefined;
  await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/user
exports.deleteItemFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { items: { _id: req.params.itemId } } },
    { new: true, runValidators: true }
  );

  cart.totalCartPrice = calcTotalCartPrice(cart.items);
  cart.totalPriceAfterDiscount = undefined;
  await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

// @desc    clear cart
// @route   DELETE /api/v1/cart
// @access  Private/user
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @desc    Update cart item quantity
// @route   PATCH /api/v1/cart/:itemId
// @access  Private/user
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("There is no cart for this user", 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() == req.params.itemId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = req.body.quantity;
  } else {
    return next(new ApiError("Item not found in cart", 404));
  }

  cart.totalCartPrice = calcTotalCartPrice(cart.items);
  cart.totalPriceAfterDiscount = undefined;
  await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

// @desc    Apply coupon on cart
// @route   POST /api/v1/cart/applyCoupon
// @access  Private/user
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon from coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("Coupon is invalid or expired", 400));
  }

  // 2) Get cart
  const cart = await Cart.findOne({ user: req.user._id });

  // 3) Calculate total price after discount
  const totalPriceAfterDiscount =
    cart.totalCartPrice -
    ((cart.totalCartPrice * coupon.discount) / 100).toFixed(2);

  // 4) Update cart
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});
