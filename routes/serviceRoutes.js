const router = require("express").Router();
const serviceControllers = require("../controllers/serviceControllers");
const { authGuard, adminGuard } = require("../middleware/authGuard");

// Make a create user API
router.post("/create", serviceControllers.createservice);

// controllers -routes- (Index.js)

//fetch all
//http://localhost:8000/api/service/get_all_services
// router.get("/get_all_services", authGuard, serviceControllers.getAllservices);
router.get("/get_all_services", serviceControllers.getAllservices);

//fetch single service
// if POST, body(data)
router.get("/get_single_service/:id", authGuard, serviceControllers.getservice);

//delte service
router.delete(
  "/delete_service/:id",
  adminGuard,
  serviceControllers.deleteservice
);

//update service
router.put("/update_service/:id", adminGuard, serviceControllers.updateservice);

// pagination
router.get("/pagination", serviceControllers.servicePagination);

// Route to search for services by sevice name
router.post("/search", serviceControllers.searchServicesByName);

//exporting
module.exports = router;
