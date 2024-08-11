// write a funstion
// importing packages
// Always export the function

// 1. importing the packages
const mongoose = require("mongoose");

//2. creating a function   --> to use ina another place
const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Database connected sucessfully");
  });
};

// 3. Exporting the function
module.exports = connectDB;
