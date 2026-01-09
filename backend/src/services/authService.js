// backend/src/services/authService.js
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} User and tokens
 */
const registerUser = async (userData) => {
  const { name, email, password, role, walletAddress, expertise, hourlyRate, bio } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Create new user
  const user = new User({
    name,
    email,
    password,
    role: role || "learner",
    walletAddress,
    expertise,
    hourlyRate,
    bio,
  });

  await user.save();

  // Generate tokens
  const tokenPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: user.toPublicJSON(),
    accessToken,
    refreshToken,
  };
};

/**
 * Login user
 * @param {String} email - User email
 * @param {String} password - User password
 * @returns {Object} User and tokens
 */
const loginUser = async (email, password) => {
  // Find user with password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check if user is active
  if (!user.isActive) {
    throw new Error("Account is deactivated. Please contact support.");
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate tokens
  const tokenPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: user.toPublicJSON(),
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh access token
 * @param {String} refreshToken - Refresh token
 * @returns {Object} New access token
 */
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Find user with refresh token
  const user = await User.findOne({
    _id: decoded.userId,
    refreshToken,
  }).select("+refreshToken");

  if (!user) {
    throw new Error("Invalid refresh token");
  }

  // Generate new access token
  const tokenPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);

  return {
    accessToken,
  };
};

/**
 * Logout user
 * @param {String} userId - User ID
 */
const logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Clear refresh token
  user.refreshToken = null;
  await user.save();

  return { message: "Logged out successfully" };
};

/**
 * Get user profile
 * @param {String} userId - User ID
 * @returns {Object} User profile
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return user.toPublicJSON();
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getUserProfile,
};
