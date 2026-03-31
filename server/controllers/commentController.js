import Comment from '../models/Comment.js';
import Task from '../models/Task.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get comments for a task
 * @route   GET /api/tasks/:taskId/comments
 * @access  Private
 */
export const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ task: req.params.taskId })
    .populate('author', 'name email avatar')
    .sort('-createdAt')
    .lean();

  res.status(200).json({
    success: true,
    data: comments,
  });
});

/**
 * @desc    Create comment on task
 * @route   POST /api/tasks/:taskId/comments
 * @access  Private
 */
export const createComment = asyncHandler(async (req, res) => {
  // Verify task exists
  const task = await Task.findOne({
    _id: req.params.taskId,
    deletedAt: null,
  });

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  const comment = await Comment.create({
    content: req.body.content,
    task: req.params.taskId,
    author: req.user.id,
  });

  const populated = await Comment.findById(comment._id)
    .populate('author', 'name email avatar')
    .lean();

  res.status(201).json({
    success: true,
    data: populated,
    message: 'Comment added.',
  });
});

/**
 * @desc    Update comment
 * @route   PATCH /api/comments/:id
 * @access  Private (author only)
 */
export const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw new AppError('Comment not found.', 404);
  }

  if (comment.author.toString() !== req.user.id) {
    throw new AppError('You can only edit your own comments.', 403);
  }

  comment.content = req.body.content;
  comment.isEdited = true;
  await comment.save();

  const populated = await Comment.findById(comment._id)
    .populate('author', 'name email avatar')
    .lean();

  res.status(200).json({
    success: true,
    data: populated,
    message: 'Comment updated.',
  });
});

/**
 * @desc    Delete comment
 * @route   DELETE /api/comments/:id
 * @access  Private (author only)
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw new AppError('Comment not found.', 404);
  }

  if (comment.author.toString() !== req.user.id) {
    throw new AppError('You can only delete your own comments.', 403);
  }

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Comment deleted.',
  });
});
