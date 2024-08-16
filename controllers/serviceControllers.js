const path = require("path");
const serviceModel = require("../models/serviceModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");
const fs = require("fs");

const createservice = async (req, res) => {
  //check incoming data
  console.log(req.body);
  console.log(req.files);

  //Task: destructuring, validation
  const {
    serviceTitle,
    servicePrice,
    serviceCategory,
    serviceDescription,
    serviceLocation,
  } = req.body;

  if (
    !serviceTitle ||
    !servicePrice ||
    !serviceCategory ||
    !serviceDescription ||
    !serviceLocation
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  //check service image
  if (!req.files || !req.files.serviceImage) {
    return res.status(400);
  }

  const { serviceImage } = req.files;

  //uploading
  //1. Genarate unique name for each file
  const imageName = `${Date.now()}-${serviceImage.name}`;
  //2. define sspecific path
  const imageUploadPath = path.join(
    __dirname,
    `../public/services/${imageName}`
  );
  //3. Upload to that path
  try {
    await serviceImage.mv(imageUploadPath);

    //save to data database
    const newservice = new serviceModel({
      serviceTitle: serviceTitle,
      servicePrice: servicePrice,
      serviceCategory: serviceCategory,
      serviceDescription: serviceDescription,
      serviceLocation: serviceLocation,
      serviceImage: imageName,
    });
    const service = await newservice.save();
    res.status(201).json({
      success: true,
      message: "service Created",
      data: service,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

//fetch all services
const getAllservices = async (req, res) => {
  try {
    //logic
    //Find all the services
    const services = await serviceModel.find({});
    // send response
    res.status(201).json({
      success: true,
      message: "service fetched successfully!",
      services: services,
    });
  } catch (error) {
    console.log(error);
  }
};
// fetch single service
const getservice = async (req, res) => {
  // receive id from URL
  const serviceId = req.params.id;

  try {
    const service = await serviceModel.findById(serviceId);
    console.log(service);
    res.status(201).json({
      success: true,
      message: "service Fetched!",
      service: service,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error!",
    });
  }
};

//delete service
// const deleteservice = async (req, res) => {
//   //get service id
//   const serviceId = req.params.id;

//   try {
//     await serviceModel.findByIdAndDelete(serviceId);

//     res.status(201).json({
//       success: true,
//       message: "service Deleted!",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

const deleteService = async (req, res) => {
  const serviceId = req.params.id;
  const userId = req.user.id; // Assuming you have user information in req.user

  try {
    const existingService = await serviceModel.findById(serviceId);

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    if (existingService.createdBy !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Permission denied",
      });
    }

    const oldImagePath = path.join(
      __dirname,
      `../public/services/${existingService.serviceImage}`
    );

    // delete from file system
    fs.unlinkSync(oldImagePath);

    await Services.findByIdAndDelete(serviceId);
    res.status(200).json({
      success: true,
      message: "Service deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//update service
//1.Get a update id
//2. If new image is provided
//3. Upload (public)
//4. Delete old Image
//5.Update services

const updateservice = async (req, res) => {
  try {
    //if there is files, upload new and delete the old one
    if (req.files && req.files.serviceImage) {
      //upload new to /public/services
      //1.Destrusture files
      const { serviceImage } = req.files;

      //make a new image name
      //1. Genarate unique name for each file
      const imageName = `${Date.now()}-${serviceImage.name}`;
      //2. define sspecific path
      const imageUploadPath = path.join(
        __dirname,
        `../public/services/${imageName}`
      );

      //move to folder
      await serviceImage.mv(imageUploadPath);

      //replace serviceImage name to new name
      req.body.serviceImage = imageName;

      //# Delete the old image
      // Find  produc tInfo (e have onlby ID)
      const existingservice = await serviceModel.findById(req.params.id);

      //Search that iomage in directory
      if (req.body.serviceImage) {
        //if new image is uploaaded, then only remove old image
        const oldImagePath = path.join(
          __dirname,
          `../public/services/${existingservice.serviceImage}`
        );
        //delete from file system
        fs.unlinkSync(oldImagePath);
      }
    }
    //update in database
    const updatedservice = await serviceModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    //send a response
    res.status(201).json({
      success: true,
      message: "service Updated!",
      updatedservice: updatedservice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error,
    });
  }
};

//pagination

// pagination
const servicePagination = async (req, res) => {
  // result per page
  const resultPerPage = 4;

  // page no (received from user)
  const pageNo = req.query._page;
  // const pageNo = parseInt(req.query._page) || 1; // Default to page 1 if not provided
  console.log(pageNo);

  try {
    const services = await serviceModel
      .find({})
      .skip((pageNo - 1) * resultPerPage)
      .limit(resultPerPage);
    console.log(services);
    // if there is no service
    if (services.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No service Found!",
      });
    }
    res.status(201).json({
      success: true,
      message: "service Fetched",
      services: services,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error!",
    });
  }
};

// Controller action to search for services by service name
const searchServicesByName = async (req, res) => {
  try {
    const { serviceTitle } = req.body;

    // Use a regular expression to perform a case-insensitive search
    const services = await serviceModel.find({
      serviceTitle: { $regex: serviceTitle, $options: "i" },
    });

    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllServicesByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    const service = await serviceModel.find({ createdBy: userId }).exec();
    if (!service) {
      console.log(service);
    }
    res.status(201).json({
      success: true,
      message: "Service Fetched!",
      service: service,
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      message: "Server Error!",
    });
  }
};

const addFavoriteService = async (req, res) => {
  try {
    console.log("User from token:", req.user);
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Ensure favorites is an array
    if (!Array.isArray(user.favorites)) {
      user.favorites = [];
    }

    const { serviceId } = req.body;
    if (!serviceId) {
      return res
        .status(400)
        .json({ success: false, message: "Service ID is required" });
    }

    if (!user.favorites.includes(serviceId)) {
      user.favorites.push(serviceId);
      await user.save();
      res
        .status(200)
        .json({ success: true, message: "Service added to favorites" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Service already in favorites" });
    }
  } catch (error) {
    console.error("Error in addFavoriteService:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const removeFavoriteService = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { serviceId } = req.params; // Use req.params to match the route parameter

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.favorites = user.favorites.filter(
      (favorite) => favorite.toString() !== serviceId
    );
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Service removed from favorites" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getFavoriteServices = async (req, res) => {
  try {
    const userId = req.user.id; // From authGuard

    // Fetch the user and populate the 'favorites' field with service details
    const user = await User.findById(userId).populate("favorites");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    console.error("Error in getFavoriteServices:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const createReview = async (req, res) => {
  const { serviceId, rating, comment } = req.body;

  if (!serviceId || !rating || !comment) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const review = new Review({
      serviceId: serviceId,
      userId: req.user.id,
      rating: rating,
      comment: comment,
    });

    await review.save();

    const service = await serviceModel.findById(serviceId);

    // Update the average rating and number of reviews
    service.numberOfReviews += 1;
    service.averageRating =
      (service.averageRating * (service.numberOfReviews - 1) + rating) /
      service.numberOfReviews;

    await service.save();

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

// Get reviews for a service
const getServiceReviews = async (req, res) => {
  const serviceId = req.params.id;

  try {
    const reviews = await Review.find({ serviceId: serviceId }).populate(
      "userId",
      "fname"
    );

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

// Update a review
const updateReview = async (req, res) => {
  const { reviewId, rating, comment } = req.body;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (!review.isOwner(req.user)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createservice,
  getAllservices,
  getservice,
  updateservice,
  deleteService,
  servicePagination,
  searchServicesByName,

  getAllServicesByUserId,
  addFavoriteService,
  removeFavoriteService,
  getFavoriteServices,
  createReview,
  getServiceReviews,
  updateReview,
};
