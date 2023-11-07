const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const handlerFactory = require("./handlerFactory");
const ApiError = require("../Utils/apiError");

const Cart = require("../Models/cartModel");
const Product = require("../Models/productModel");
const Order = require("../Models/orderModel");

// @desc    Create cash order
// @route   POST /api/v1/orders/:cartId
// @access  protected/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  //admin setting
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart depending on the cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("There is no cart with this ID", 404));
  }
  // 2) Get order price depending on the cart price "check if coupon is applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3) Create order with default payment method "Cash"
  const order = await Order.create({
    user: req.user._id,
    items: cart.items,
    taxPrice,
    shippingPrice,
    totalPrice: totalOrderPrice,
  });
  // 4) After creating order, decrease the quantity of each product in the cart, increase the sales of each product in the cart
  if (order) {
    const bulkOption = cart.items.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new ApiError(`Product with id ${item.product} not found`, 404);
      }
      if (product.quantity < item.quantity) {
        throw new ApiError(
          `Not enough quantity for product ${product.title}`,
          400
        );
      }
      return {
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      };
    });
    await Promise.all(bulkOption).then(async (result) => {
      await Product.bulkWrite(result, {});
    });

    // 5) Delete the cart
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  }
  next();
});

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  protected/user-admin-manager
exports.getAllOrders = handlerFactory.getAll(Order);

// @desc    Get order by id
// @route   GET /api/v1/orders/:id
// @access  protected/user-admin-manager
exports.getOrderById = handlerFactory.getOne(Order);

// @desc    Update order to paid
// @route   PATCH /api/v1/orders/:id/pay
// @access  protected/admin-manager
exports.updateOrderToPay = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("There is no order with this ID", 404));
  }
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({
    status: "success",
    data: {
      order: updatedOrder,
    },
  });
});

// @desc    Update order to delivered
// @route   PATCH /api/v1/orders/:id/deliver
// @access  protected/admin-manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("There is no order with this ID", 404));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({
    status: "success",
    data: {
      order: updatedOrder,
    },
  });
});

// @desc    Get checkout session from stripe and send it to the client
// @route   GET /api/v1/orders/checkout-session/:cartId
// @access  protected/user
exports.getCheckoutSession = asyncHandler(async (req, res, next) => {
  // admin setting
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart depending on the cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("There is no cart with this ID", 404));
  }

  // 2) Get order price depending on the cart price "check if coupon is applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
            description: `Order with ${cart.items.length} items`,
          },
        },

        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4) Send session to the client
  res.status(200).json({
    status: "success",
    data: {
      session,
    },
  });
});

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    console.log("Payment was successful");
  }
});
