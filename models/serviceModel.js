const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    serviceTitle: {
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
    contact: {
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
    // createdBy: {
    //   type: String,
    //   required: true,
    // },
    isApproved: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const services = mongoose.model("services", serviceSchema);
module.exports = services;

//
