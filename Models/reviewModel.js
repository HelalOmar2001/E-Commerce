const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      required: [true, "Review must have a rating"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (productId) {
  const results = await this.aggregate([
    // 1. Get all reviews for the given product (Match stage)
    { $match: { product: productId } },
    // 2. Calculate the average ratings (Grouping stage)
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  console.log(results);
  if (results.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: results[0].ratingsQuantity,
      ratingsAverage: results[0].avgRatings,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  // this points to the current review
  await this.constructor.calcAverageRatings(this.product);
});

reviewSchema.post("remove", async function () {
  // this points to the current review
  await this.constructor.calcAverageRatings(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
