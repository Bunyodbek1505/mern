// authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Get token after "Bearer "

  // console.log(token, req.header)
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, "fullstack");
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json('Invalid token');
  }
};

module.exports = authMiddleware;
