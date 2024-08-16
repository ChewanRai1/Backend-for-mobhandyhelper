const router = require("express").Router();
const userControllers = require("../controllers/userControllers");
const { authGuard } = require("../middleware/authGuard");

// Make a create user API
router.post("/create", userControllers.createUser);

// controllers -routes- (Index.js)

// login user api
router.post("/login", userControllers.loginUser);

// logout user API
router.post("/logout", userControllers.logoutUser);

// Get user details
router.get("/details/:userId", authGuard, userControllers.getUserDetails);

// Update user profile by user ID
router.put("/update/:id", authGuard, userControllers.updateUserProfile);

// Change password
router.put("/change-password", authGuard, userControllers.changeUserPassword);

//Forgot Password
router.post("/forgot_password", userControllers.forgotPassword);

//verify by otp
router.post("/verify_otp", userControllers.verifyOtpAndPassword);

//exporting
module.exports = router;
