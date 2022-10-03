const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return token;
};

const verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    throw new Error("Invalid token");
  }

  return decoded;
};

const tokenUtils = {
  generateToken,
  verifyToken,
};

module.exports = tokenUtils;
