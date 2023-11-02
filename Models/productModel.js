const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter product title"],
      trim: true,
      minlenght: [3, "Product title must be at least 3 characters long"],
      maxlength: [100, "Product title must be at most 100 characters long"],
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
      trim: true,
      minlenght: [
        20,
        "Product description must be at least 20 characters long",
      ],
    },
    quantity: {
      type: Number,
      required: [true, "Please enter product quantity"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      trim: true,
      max: [1000000, "Product price must be at most 1000000"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    imageCover: {
      type: String,
      required: [true, "Please enter product image cover"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Please enter product category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Subcategory",
      },
    ],
    brands: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Brand",
      },
    ],
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

const setImageURL = (doc) => {
  // set image base url + image name
  if (doc.imageCover) {
    doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;
  }
  if (doc.images) {
    doc.images = doc.images.map(
      (image) => `${process.env.BASE_URL}/products/${image}`
    );
  }
};

// Mongoose Query Middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

productSchema.post("init", (doc) => {
  setImageURL(doc);
});

productSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Product", productSchema);
