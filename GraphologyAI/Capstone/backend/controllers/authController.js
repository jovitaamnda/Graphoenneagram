const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

// ==============================
// REGISTER
// ==============================
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, phoneNumber, age, gender, education, dominant_hand } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Please add all fields', 400));
  }

  const userData = {
    name,
    email,
    password,
    phoneNumber,
    profile: { age, gender, education, dominant_hand },
  };

  const result = await authService.register(userData);
  res.status(201).json(result);
});

// ==============================
// LOGIN
// ==============================
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const result = await authService.login(email, password);
  const { token, user } = result;

  const isProduction = process.env.NODE_ENV === 'production';

  // SET COOKIE
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// ==============================
// GET ME
// ==============================
const getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user);
});

// ==============================
// UPDATE PROFILE
// ==============================
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const updateData = { ...req.body };

  // Handle profile fields
  if (
    req.body.age ||
    req.body.gender ||
    req.body.education ||
    req.body.dominant_hand
  ) {
    updateData.profile = {
      ...(req.body.age && { age: req.body.age }),
      ...(req.body.gender && { gender: req.body.gender }),
      ...(req.body.education && { education: req.body.education }),
      ...(req.body.dominant_hand && { dominant_hand: req.body.dominant_hand }),
    };
  }

  // Handle profile picture upload
  if (req.file) {
    updateData.profilePicture = `/uploads/profiles/${req.file.filename}`;
  }

  const result = await authService.updateProfile(req.user._id, updateData);
  res.json(result);
});

// ==============================
// CHANGE PASSWORD
// ==============================
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Please provide current and new password', 400));
  }

  const result = await authService.changePassword(
    req.user._id,
    currentPassword,
    newPassword
  );

  res.json(result);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  changePassword,
};
