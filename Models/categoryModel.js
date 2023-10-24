const mongoose = require("mongoose");
// 1- Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minlength: [3, "Category name must be at least 3 characters long"],
      maxlength: [32, "Category name must be less than 32 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

const setImageURL = (doc) => {
  // set image base url + image name
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/categories/${doc.image}`;
  }
};

// post init hook to set image url
// works with find, findOne, findById, findByIdAndUpdate
categorySchema.post("init", function (doc) {
  setImageURL(doc);
});

// post save hook to set image url
// works with save, create, findOneAndUpdate
categorySchema.post("save", function (doc) {
  // set image base url + image name
  setImageURL(doc);
});

// 2- Create Model
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
