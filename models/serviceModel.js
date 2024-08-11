const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
    },
    servicePrice: {
      type: Number,
      required: true,
    },
    serviceDescription: {
      type: String,
      required: true,
      maxlength: 300,
    },
    serviceCategory: {
      type: String,
      required: true,
    },
    serviceLocation: {
      type: String,
      required: true,
    },
    serviceImage: {
      type: String,
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const services = mongoose.model("services", serviceSchema);
module.exports = services;

//
