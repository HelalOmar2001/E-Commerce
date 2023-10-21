const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("DB connection successful!"));
};

module.exports = dbConnection;
