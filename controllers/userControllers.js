const User = require("../models/userModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Make a functon (Logic)

// 1. creating user function

const createUser = async (req, res) => {
  // res.send("Create API is working")
  // 1. Get data from the user (Fname, lname, email,pp)
  console.log(req.body);

  // #. Destruction
  const { fname, lname, phone, email, username, password } = req.body;
  // 2. validation
  if (!fname || !lname || !phone || !email || !username || !password) {
    return res.json({
      success: false,
      message: "please enter all fields!",
    });
  }
  // error handling= Try and Catch
  try {
    // 2.1 if not : send the reponse and stop the process
    // 3. if proper data
    // 4. check existing User
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      res.json({
        success: false,
        message: "User Already Exists!",
      });
    }

    //Hashing / Encrypt the Password
    const randomSalt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, randomSalt);

    // 4.1 if yes : Send the response and stop the process
    //  if not:
    // 5. Save in the database
    const newUser = new userModel({
      //fields : Values received form user
      fname: fname,
      lname: lname,
      phone: phone,
      email: email,
      username: username,
      password: hashPassword,
    });

    //Actually save the user in database
    await newUser.save();
    // 6. send the succes response
    res.json({
      success: true,
      message: "User Created successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "internal server error!",
    });
  }
};
//2. Login user function
const loginUser = async (req, res) => {
  // res.send("Login user API is working")
  //check incoming data :pass
  console.log(req.body);

  // #. Destruction
  const { email, password } = req.body;
  // 2. validation
  if (!email || !password) {
    return res.json({
      success: false,
      message: "please enter both fields!",
    });
  }
  try {
    //1.find user, if not : stop the process
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        "message ": "User not found!",
      });
    }

    //2. compare the password, if not : stop the process
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.json({
        success: false,
        "message ": "Incorrect Password!",
      });
    }

    //3. Generate JWT token
    //3.1 Secret Decryption Key (.env)
    const token = await jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );
    //4. Send the token, userData, Message to the user

    res.json({
      success: true,
      message: "Login succesful",
      token: token,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

//3. Update profile
//4. Change Password

//exporting
// module.exports = createUser  // only for create user

// Logout user function
const logoutUser = async (req, res) => {
  // For now, just return a success message since token management is client-side.
  // If you want to handle blacklisting tokens or session management, you would implement it here.
  res.json({
    success: true,
    message: "Logout successful",
  });
};

// Get user details
const getUserDetails = async (req, res) => {
  const { userId } = req.params; // Extract userId from request parameters

  try {
    // Find the user by the userId passed in the request parameters
    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update user profile
// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    // Get the user ID from the URL parameters
    const userId = req.params.id;
    const updatedData = req.body;

    // Find the user by ID and update the profile
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true, // Return the updated document
    }).select("-password"); // Exclude the password field

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile updated", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Change password
const changeUserPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect current password" });
    }

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP and its expiry time (1 hour)
    user.otpReset = otp;
    user.otpResetExpires = Date.now() + 3600000;
    await user.save();

    // Configure the email transport
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Access email user from .env
        pass: process.env.EMAIL_PASS, // Access email password from .env
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Use the same email as the sender
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email send error:", error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({ message: "Password reset OTP sent" });
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const verifyOtpAndPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    let storedOtp = String(user.otpReset).trim();
    let receivedOtp = String(otp).trim();

    console.log("Stored OTP:", storedOtp, "Length:", storedOtp.length);
    console.log("Received OTP:", receivedOtp, "Length:", receivedOtp.length);

    if (storedOtp !== receivedOtp) {
      console.log("OTPs do not match");
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > user.otpResetExpires) {
      console.log("OTP has expired");
      return res.status(400).json({ message: "Expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otpReset = undefined;
    user.otpResetExpires = undefined;
    await user.save();

    console.log("Password reset successfully");
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getUserDetails,
  updateUserProfile,
  changeUserPassword,
  forgotPassword,
  verifyOtpAndPassword,
};
