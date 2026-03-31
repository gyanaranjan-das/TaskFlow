import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import cloudinary from '../config/cloudinary.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: { user: user.toSafeObject() },
  });
});

/**
 * @desc    Update user profile
 * @route   PATCH /api/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, preferences } = req.body;
  const user = await User.findById(req.user.id);

  if (name) user.name = name;
  if (preferences) {
    if (preferences.theme) user.preferences.theme = preferences.theme;
    if (typeof preferences.emailNotifications === 'boolean') {
      user.preferences.emailNotifications = preferences.emailNotifications;
    }
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: { user: user.toSafeObject() },
    message: 'Profile updated successfully.',
  });
});

/**
 * @desc    Upload avatar
 * @route   POST /api/users/avatar
 * @access  Private
 */
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Please upload an image file.', 400);
  }

  const user = await User.findById(req.user.id);

  // Delete old avatar from Cloudinary
  if (user.avatar.publicId) {
    await cloudinary.uploader.destroy(user.avatar.publicId);
  }

  // Upload new avatar
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'taskflow/avatars',
        transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(req.file.buffer);
  });

  user.avatar = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: { avatar: user.avatar },
    message: 'Avatar updated successfully.',
  });
});

/**
 * @desc    Change password
 * @route   PATCH /api/users/password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect.', 400);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully.',
  });
});

/**
 * @desc    Search users by name or email
 * @route   GET /api/users/search?q=query
 * @access  Private
 */
export const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(200).json({ success: true, data: [] });
  }

  const users = await User.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ],
    _id: { $ne: req.user.id }, // Exclude current user
  })
    .select('name email avatar')
    .limit(10)
    .lean();

  res.status(200).json({
    success: true,
    data: users,
  });
});
