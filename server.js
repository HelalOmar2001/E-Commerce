const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "./config.env" });

const ApiError = require("./Utils/apiError");
const globalError = require("./Middlewares/errorMiddleware");
const dbConnection = require("./Config/database");

const mountRoutes = require("./Routes");
const { webhookCheckout } = require("./Controllers/orderController");

// DB Connection
dbConnection();

// Express app
const app = express();

// Enable cors for all requests
app.use(cors());
app.options("*", cors());

// Compression middleware for all responses
app.use(compression());

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// Middleware
app.use(express.json());
app.use(express.static(`${__dirname}/uploads`));

// app.use(fileUpload());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // // res.status(404).json({ err: "Page not found" });
  // console.log(err);
  // next(err.message);
  next(new ApiError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use(globalError);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Handle rejections outside express
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
