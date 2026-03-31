import crypto from 'crypto';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  generateCryptoToken,
} from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import { COOKIE_OPTIONS } from '../utils/constants.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  // Generate email verification token
  const { token: verifyToken, hashedToken } = generateCryptoToken();

  // Create user (unverified)
  const user = await User.create({
    name,
    email,
    password,
    verifyToken: hashedToken,
    verifyTokenExpiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  // Send verification email
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;
  await sendEmail({
    to: email,
    subject: 'Verify your TaskFlow account',
    html: `
      <h1>Welcome to TaskFlow!</h1>
      <p>Hi ${name},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background-color:#6366f1;color:white;text-decoration:none;border-radius:8px;">Verify Email</a>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't create this account, please ignore this email.</p>
    `,
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully. Please check your email to verify your account.',
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  // Check if verified
  if (!user.isVerified) {
    throw new AppError('Please verify your email before logging in.', 403);
  }

  // Generate tokens
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const { token: refreshToken, hashedToken, family } = generateRefreshToken();

  // Store refresh token in DB
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    hashedToken,
    user: user._id,
    family,
    expiresAt,
  });

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Store family in cookie for rotation detection
  res.cookie('tokenFamily', family, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    data: {
      accessToken,
      user: user.toSafeObject(),
    },
    message: 'Login successful.',
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public (cookie required)
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken, tokenFamily } = req.cookies;

  if (!refreshToken || !tokenFamily) {
    throw new AppError('No refresh token provided.', 401);
  }

  const hashedIncoming = hashToken(refreshToken);

  // Find the stored token
  const storedToken = await RefreshToken.findOne({ hashedToken: hashedIncoming });

  if (!storedToken) {
    // Possible reuse attack: token not found but family exists
    const familyExists = await RefreshToken.findOne({ family: tokenFamily });
    if (familyExists) {
      // Delete ALL tokens in this family (reuse attack detected)
      await RefreshToken.deleteMany({ family: tokenFamily });
    }
    // Clear cookies
    res.clearCookie('refreshToken');
    res.clearCookie('tokenFamily');
    throw new AppError('Invalid refresh token. Please log in again.', 401);
  }

  // Check expiry
  if (storedToken.expiresAt < new Date()) {
    await storedToken.deleteOne();
    throw new AppError('Refresh token expired. Please log in again.', 401);
  }

  // Delete old token
  await storedToken.deleteOne();

  // Issue new pair
  const user = await User.findById(storedToken.user);
  if (!user) {
    throw new AppError('User not found.', 401);
  }

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const { token: newRefreshToken, hashedToken: newHashedToken } = generateRefreshToken();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    hashedToken: newHashedToken,
    user: user._id,
    family: tokenFamily, // keep same family
    expiresAt,
  });

  res.cookie('refreshToken', newRefreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    data: { accessToken },
    message: 'Token refreshed.',
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    const hashedToken = hashToken(refreshToken);
    await RefreshToken.findOneAndDelete({ hashedToken });
  }

  res.clearCookie('refreshToken');
  res.clearCookie('tokenFamily');

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    verifyToken: hashedToken,
    verifyTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Invalid or expired verification token.', 400);
  }

  user.isVerified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully. You can now log in.',
  });
});

/**
 * @desc    Forgot password - send reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // Always return same response (prevent email enumeration)
  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a reset link has been sent.',
    });
  }

  const { token, hashedToken } = generateCryptoToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: 'Reset your TaskFlow password',
    html: `
      <h1>Password Reset Request</h1>
      <p>Hi ${user.name},</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background-color:#6366f1;color:white;text-decoration:none;border-radius:8px;">Reset Password</a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });

  res.status(200).json({
    success: true,
    message: 'If an account exists with that email, a reset link has been sent.',
  });
});

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token.', 400);
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  // Invalidate all refresh tokens for this user
  await RefreshToken.deleteMany({ user: user._id });

  res.status(200).json({
    success: true,
    message: 'Password reset successful. Please log in with your new password.',
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: { user: user.toSafeObject() },
  });
});
