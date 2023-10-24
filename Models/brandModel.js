const mongoose = require("mongoose");
// 1- Create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name must be unique"],
      minlength: [3, "Brand name must be at least 3 characters long"],
      maxlength: [32, "Brand name must be less than 32 characters long"],
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
brandSchema.post("init", function (doc) {
  setImageURL(doc);
});

// post save hook to set image url
// works with save, create, findOneAndUpdate
brandSchema.post("save", function (doc) {
  // set image base url + image name
  setImageURL(doc);
});

// 2- Create Model
module.exports = mongoose.model("Brand", brandSchema);
