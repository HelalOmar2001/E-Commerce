const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "SubCategory name is required"],
      trim: true,
      minlength: [3, "SubCategory name must be at least 3 characters long"],
      maxlength: [32, "SubCategory name must be less than 32 characters long"],
      unique: [true, "SubCategory name must be unique"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "subCategory must belong to parent category"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
