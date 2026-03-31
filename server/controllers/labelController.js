import Label from '../models/Label.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all labels for current user
 * @route   GET /api/labels
 * @access  Private
 */
export const getLabels = asyncHandler(async (req, res) => {
  const labels = await Label.find({ user: req.user.id })
    .sort('name')
    .lean();

  res.status(200).json({
    success: true,
    data: labels,
  });
});

/**
 * @desc    Create label
 * @route   POST /api/labels
 * @access  Private
 */
export const createLabel = asyncHandler(async (req, res) => {
  const label = await Label.create({
    ...req.body,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: label,
    message: 'Label created successfully.',
  });
});

/**
 * @desc    Update label
 * @route   PATCH /api/labels/:id
 * @access  Private
 */
export const updateLabel = asyncHandler(async (req, res) => {
  const label = await Label.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!label) {
    throw new AppError('Label not found.', 404);
  }

  Object.keys(req.body).forEach((key) => {
    label[key] = req.body[key];
  });

  await label.save();

  res.status(200).json({
    success: true,
    data: label,
    message: 'Label updated.',
  });
});

/**
 * @desc    Delete label
 * @route   DELETE /api/labels/:id
 * @access  Private
 */
export const deleteLabel = asyncHandler(async (req, res) => {
  const label = await Label.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!label) {
    throw new AppError('Label not found.', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Label deleted.',
  });
});
