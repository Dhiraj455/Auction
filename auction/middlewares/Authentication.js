const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/jwt");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        error: "Please authenticate",
      });
    }
    const decoded = verifyToken(token);
    if (decoded.user.role === "user") {
      const user = await User.findById(decoded.user.id);
      if (!user) {
        return res.status(401).json({
          error: "Please authenticate",
        });
      }
      req.user = user;
      req.admin = false;
      return next();
    }
    if (decoded.user.role === "admin") {
      req.admin = true;
      return next();
    }
    throw new Error("Invalid token");
  } catch (err) {
    log.error(err);
    return res.status(401).json({
      error: "Please authenticate",
    });
  }
};

module.exports = auth;
