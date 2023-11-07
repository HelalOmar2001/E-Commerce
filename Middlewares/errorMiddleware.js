const ApiError = require("../Utils/apiError");

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // 500 -> Internal server error
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalid(err, res);
    if (err.name === "TokenExpiredError") err = handleJwtExpired(err, res);
    sendErrorProd(err, res);
  }
};

const handleJwtExpired = () => {
  return new ApiError("Token expired. Please log in again", 401);
};

const handleJwtInvalid = () => {
  return new ApiError("Invalid token. Please log in again", 401);
};

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalError;
