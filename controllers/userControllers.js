const User = require("../models/userModels");
const userModel = require("../models/userModels");
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

// Other functions...

module.exports = {
  createUser,
  loginUser,
  logoutUser,
};
