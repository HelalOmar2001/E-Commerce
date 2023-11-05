const express = require("express");
const orderController = require("../Controllers/orderController");
const authController = require("../Controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get(
  "/checkout-session/:cartId",
  authController.allowedTo("user"),
  orderController.getCheckoutSession
);

router
  .route("/")
  .get(
    authController.allowedTo("admin", "manager", "user"),
    orderController.filterOrderForLoggedUser,
    orderController.getAllOrders
  );

router.route("/:id").get(orderController.getOrderById);

router
  .route("/:id/pay")
  .patch(
    authController.allowedTo("admin", "manager"),
    orderController.updateOrderToPay
  );

router
  .route("/:id/deliver")
  .patch(
    authController.allowedTo("admin", "manager"),
    orderController.updateOrderToDelivered
  );

router.route("/:cartId").post(orderController.createCashOrder);

module.exports = router;
