const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, "test_jwt_secret", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Attach the user ID to the request object for further use
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    next();
  });
};

module.exports.jwtSecretKey = "test_jwt_secret";
