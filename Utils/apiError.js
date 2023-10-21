// @desc   this class is responsible for handling errors
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; // 404 -> fail, 500 -> error
    this.isOperational = true; // for operational errors
  }
}

module.exports = ApiError;
