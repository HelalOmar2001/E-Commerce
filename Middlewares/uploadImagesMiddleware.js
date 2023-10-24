const multer = require("multer");
const ApiError = require("../Utils/apiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    console.log(file);

    if (file.mimetype.startsWith("image")) cb(null, true);
    else
      cb(new ApiError("Not an image! Please upload only images.", 400), false);
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => {
  return multerOptions().single(fieldName);
};

exports.uploadMultipleImages = (arrayOfFields) => {
  return multerOptions().fields(arrayOfFields);
};
