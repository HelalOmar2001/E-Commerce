const express = require("express");

const couponController = require("../Controllers/couponController");
const authController = require("../Controllers/authController");

const router = express.Router();

router.use(
  authController.protect,
  authController.allowedTo("admin", "manager")
);

router
  .route("/")
  .get(couponController.getAllCoupons)
  .post(couponController.createCoupon);

router
  .route("/:id")
  .get(couponController.getCoupon)
  .patch(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

module.exports = router;
