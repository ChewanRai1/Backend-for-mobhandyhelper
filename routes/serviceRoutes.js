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
router.get("/get_single_service/:id", serviceControllers.getservice);

//delte service
router.delete(
  "/delete_service/:id",
  adminGuard,
  serviceControllers.deleteService
);

//update service
router.put("/update_service/:id", adminGuard, serviceControllers.updateservice);

// pagination
router.get("/pagination", serviceControllers.servicePagination);

// Route to search for services by sevice name
router.post("/search", serviceControllers.searchServicesByName);

//get all service by id
router.get(
  "/get_all_service_by_userid/:id",
  serviceControllers.getAllServicesByUserId
);

// Add to favorites route
router.post("/add_favorite", authGuard, serviceControllers.addFavoriteService);

// Remove from favorites route
router.delete(
  "/remove_favorite/:serviceId",
  authGuard,
  serviceControllers.removeFavoriteService
);

// Get favorite services route
router.get("/favorites/:id", authGuard, serviceControllers.getFavoriteServices);

// Review operations
router.post("/create_review", authGuard, serviceControllers.createReview);
router.get("/reviews/:id", authGuard, serviceControllers.getServiceReviews);

router.post("/update_review", authGuard, serviceControllers.updateReview);

//exporting
module.exports = router;
