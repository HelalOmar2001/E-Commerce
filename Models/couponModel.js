const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Name is required"],
    },
    expire: {
      type: Date,
      required: [true, "Expire date is required"],
    },
    discount: {
      type: Number,
      required: [true, "Discount is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
