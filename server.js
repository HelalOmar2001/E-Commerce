const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "./config.env" });

const ApiError = require("./Utils/apiError");
const globalError = require("./Middlewares/errorMiddleware");
const dbConnection = require("./Config/database");
const categoryRouter = require("./Routes/categoryRouter");
const subCategoryRouter = require("./Routes/subCategoryRouter");
const brandRouter = require("./Routes/brandRouter");
const productRouter = require("./Routes/productRouter");
const userRouter = require("./Routes/userRouter");
const authRouter = require("./Routes/authRouter");
const reviewRouter = require("./Routes/reviewRouter");

// DB Connection
dbConnection();

// Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(`${__dirname}/uploads`));

// app.use(fileUpload());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Routes
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subCategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewRouter);

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
