const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");

const protect = asyncHandler(async (req, res, next) => {
  // 1. Allow Preflight CORS
  if (req.method === "OPTIONS") {
    return next();
  }

  let token;

  // Check Authorization Header (Bearer Token)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Fallback: Check Cookie if header is missing
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError("Not authorized, no token provided", 401));
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user) {
    return next(new AppError("User not found", 401));
  }

  next();
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(new AppError("Not authorized as admin", 403));
  }
};

module.exports = { protect, admin };

