const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  otpReset: {
    type: Number,
    default: null,
  },
  otpResetExpires: {
    type: Date,
    default: null,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "services",
    },
  ],
});
const User = mongoose.model("users", userSchema);
module.exports = User;
