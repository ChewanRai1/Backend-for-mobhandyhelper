const jwt = require("jsonwebtoken");
const authGuard = (req, res, next) => {
  //# check incoming data
  console.log(req.headers);
  //   //1.Get auth headers(content type, authorization...)
  //   //2. Get 'Atuhorization'
  const authHeader = req.headers.authorization;
  //   //3. if not found stop the process (response)
  if (!authHeader) {
    return res.status(400).json({
      success: false,
      message: "Authorization header not found",
    });
  }
  //   //4. authorization format : 'Bearer tokens'
  //   //5. get only token by splitting by space(0-Bearer, 1-token)
  const token = authHeader.split(" ")[1];
  //   //   6. if token not found or mismatch(stop the process, res)
  if (!token || token == "") {
    return res.status(400).json({
      success: false,
      message: "Token is missing!",
    });
  }
  //   //7. verify the token
  //   // 8. if verified. next
  //   //9. not:d not authenticated
  try {
    //get verfied the token and the user info
    const decodeUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeUser;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Not Authenticated",
    });
  }
};

//admin Guard
const adminGuard = (req, res, next) => {
  //# check incoming data
  console.log(req.headers);
  //   //1.Get auth headers(content type, authorization...)
  //   //2. Get 'Atuhorization'
  const authHeader = req.headers.authorization;
  //   //3. if not found stop the process (response)
  if (!authHeader) {
    return res.status(400).json({
      success: false,
      message: "Authorization header not found",
    });
  }
  //   //4. authorization format : 'Bearer tokens'
  //   //5. get only token by splitting by space(0-Bearer, 1-token)
  const token = authHeader.split(" ")[1];
  //   //   6. if token not found or mismatch(stop the process, res)
  if (!token || token == "") {
    return res.status(400).json({
      success: false,
      message: "Token is missing!",
    });
  }
  //   //7. verify the token
  //   // 8. if verified. next
  //   //9. not:d not authenticated
  try {
    //get verfied the token and the user info
    const decodeUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeUser;

    // check if user is admin or not
    if (!req.user.isAdmin) {
      return res.status(400).json({
        success: false,
        message: "Permission Denied",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Not Authenticated",
    });
  }
};
module.exports ={authGuard,adminGuard,}
// module.exports = authGuard

// const authGuard = require()