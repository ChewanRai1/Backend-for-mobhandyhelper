const path = require("path");
const serviceModel = require("../models/serviceModel");
const fs = require("fs");

const createservice = async (req, res) => {
  //check incoming data
  console.log(req.body);
  console.log(req.files);

  //Task: destructuring, validation
  const {
    serviceName,
    servicePrice,
    serviceCategory,
    serviceDescription,
    serviceLocation,
  } = req.body;

  if (
    !serviceName ||
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
      serviceName: serviceName,
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
    res.json({
      success: false,
      message: "Server Error!",
    });
  }
};

//delete service
const deleteservice = async (req, res) => {
  //get service id
  const serviceId = req.params.id;

  try {
    await serviceModel.findByIdAndDelete(serviceId);

    res.status(201).json({
      success: true,
      message: "service Deleted!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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

module.exports = {
  createservice,
  getAllservices,
  getservice,
  updateservice,
  deleteservice,
  servicePagination,
};
