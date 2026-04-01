import Task from '../models/Task.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import paginate from '../utils/paginate.js';
import cloudinary from '../config/cloudinary.js';

/**
 * @desc    Get all tasks (with filters, sort, pagination)
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = asyncHandler(async (req, res) => {
  const {
    page, limit, status, priority, project, assignee,
    label, search, dueDateFrom, dueDateTo, sort,
  } = req.query;

  const filter = { deletedAt: null };

  // User can see: tasks they created OR are assigned to
  filter.$or = [{ creator: req.user.id }, { assignees: req.user.id }];

  if (status) filter.status = { $in: status.split(',') };
  if (priority) filter.priority = { $in: priority.split(',') };
  if (project) filter.project = project;
  if (assignee) filter.assignees = assignee;
  if (label) filter.labels = { $in: label.split(',') };
  if (search) filter.$text = { $search: search };
  if (dueDateFrom || dueDateTo) {
    filter.dueDate = {};
    if (dueDateFrom) filter.dueDate.$gte = new Date(dueDateFrom);
    if (dueDateTo) filter.dueDate.$lte = new Date(dueDateTo);
  }

  // Build sort string
  let sortStr = sort || '-createdAt';

  const query = Task.find(filter)
    .populate('creator', 'name email avatar')
    .populate('assignees', 'name email avatar')
    .populate('labels', 'name color')
    .populate('project', 'name color')
    .sort(sortStr)
    .lean();

  const result = await paginate(query, { page, limit }, Task, filter);

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, deletedAt: null })
    .populate('creator', 'name email avatar')
    .populate('assignees', 'name email avatar')
    .populate('labels', 'name color')
    .populate('project', 'name color')
    .lean();

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

/**
 * @desc    Create a task
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = asyncHandler(async (req, res) => {
  const taskData = {
    ...req.body,
    creator: req.user.id,
  };

  // Auto-assign position (add to end)
  if (taskData.position === undefined) {
    const lastTask = await Task.findOne({
      status: taskData.status || 'todo',
      deletedAt: null,
      $or: [{ creator: req.user.id }, { assignees: req.user.id }],
    })
      .sort('-position')
      .select('position')
      .lean();
    taskData.position = (lastTask?.position ?? -1) + 1;
  }

  const task = await Task.create(taskData);

  const populated = await Task.findById(task._id)
    .populate('creator', 'name email avatar')
    .populate('assignees', 'name email avatar')
    .populate('labels', 'name color')
    .populate('project', 'name color')
    .lean();

  res.status(201).json({
    success: true,
    data: populated,
    message: 'Task created successfully.',
  });
});

/**
 * @desc    Update a task
 * @route   PATCH /api/tasks/:id
 * @access  Private
 */
export const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findOne({ _id: req.params.id, deletedAt: null });

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  // Update fields
  Object.keys(req.body).forEach((key) => {
    task[key] = req.body[key];
  });

  await task.save();

  const populated = await Task.findById(task._id)
    .populate('creator', 'name email avatar')
    .populate('assignees', 'name email avatar')
    .populate('labels', 'name color')
    .populate('project', 'name color')
    .lean();

  res.status(200).json({
    success: true,
    data: populated,
    message: 'Task updated successfully.',
  });
});

/**
 * @desc    Soft delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, deletedAt: null });

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  task.deletedAt = new Date();
  await task.save();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully.',
  });
});

/**
 * @desc    Restore a soft-deleted task
 * @route   PATCH /api/tasks/:id/restore
 * @access  Private
 */
export const restoreTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    deletedAt: { $ne: null },
  });

  if (!task) {
    throw new AppError('Task not found or was not deleted.', 404);
  }

  task.deletedAt = null;
  await task.save();

  res.status(200).json({
    success: true,
    data: task,
    message: 'Task restored successfully.',
  });
});

/**
 * @desc    Bulk update tasks
 * @route   PATCH /api/tasks/bulk
 * @access  Private
 */
export const bulkUpdateTasks = asyncHandler(async (req, res) => {
  const { taskIds, update } = req.body;

  const result = await Task.updateMany(
    { _id: { $in: taskIds }, deletedAt: null },
    { $set: update }
  );

  res.status(200).json({
    success: true,
    data: { modifiedCount: result.modifiedCount },
    message: `${result.modifiedCount} tasks updated.`,
  });
});

/**
 * @desc    Reorder tasks (for kanban drag-and-drop)
 * @route   PATCH /api/tasks/reorder
 * @access  Private
 */
export const reorderTasks = asyncHandler(async (req, res) => {
  const { tasks } = req.body;

  const bulkOps = tasks.map((t) => ({
    updateOne: {
      filter: { _id: t.id },
      update: { $set: { status: t.status, position: t.position } },
    },
  }));

  await Task.bulkWrite(bulkOps);

  res.status(200).json({
    success: true,
    message: 'Tasks reordered successfully.',
  });
});

/**
 * @desc    Add subtask
 * @route   POST /api/tasks/:id/subtasks
 * @access  Private
 */
export const addSubtask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, deletedAt: null });

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  task.subtasks.push({ title: req.body.title });
  await task.save();

  res.status(201).json({
    success: true,
    data: task.subtasks,
    message: 'Subtask added.',
  });
});

/**
 * @desc    Toggle subtask completion
 * @route   PATCH /api/tasks/:id/subtasks/:subtaskId
 * @access  Private
 */
export const toggleSubtask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, deletedAt: null });

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  const subtask = task.subtasks.id(req.params.subtaskId);
  if (!subtask) {
    throw new AppError('Subtask not found.', 404);
  }

  subtask.completed = !subtask.completed;
  await task.save();

  res.status(200).json({
    success: true,
    data: task.subtasks,
    message: 'Subtask updated.',
  });
});

/**
 * @desc    Delete subtask
 * @route   DELETE /api/tasks/:id/subtasks/:subtaskId
 * @access  Private
 */
export const deleteSubtask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, deletedAt: null });

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  task.subtasks = task.subtasks.filter(
    (s) => s._id.toString() !== req.params.subtaskId
  );
  await task.save();

  res.status(200).json({
    success: true,
    data: task.subtasks,
    message: 'Subtask deleted.',
  });
});

/**
 * @desc    Add attachment to task
 * @route   POST /api/tasks/:id/attachments
 * @access  Private
 */
export const addAttachment = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, deletedAt: null });

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  if (!req.file) {
    throw new AppError('No file uploaded.', 400);
  }

  // Upload to Cloudinary
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'taskflow/attachments',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(req.file.buffer);
  });

  task.attachments.push({
    name: req.file.originalname,
    url: result.secure_url,
    publicId: result.public_id,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });

  await task.save();

  res.status(201).json({
    success: true,
    data: task.attachments,
    message: 'Attachment added.',
  });
});

/**
 * @desc    Delete attachment from task
 * @route   DELETE /api/tasks/:id/attachments/:attachmentId
 * @access  Private
 */
export const deleteAttachment = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, deletedAt: null });

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  const attachment = task.attachments.id(req.params.attachmentId);
  if (!attachment) {
    throw new AppError('Attachment not found.', 404);
  }

  // Delete from Cloudinary
  if (attachment.publicId) {
    await cloudinary.uploader.destroy(attachment.publicId);
  }

  task.attachments = task.attachments.filter(
    (a) => a._id.toString() !== req.params.attachmentId
  );
  await task.save();

  res.status(200).json({
    success: true,
    message: 'Attachment deleted.',
  });
});

/**
 * @desc    Get task stats for dashboard
 * @route   GET /api/tasks/stats
 * @access  Private
 */
export const getTaskStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const stats = await Task.aggregate([
    {
      $match: {
        deletedAt: null,
        $or: [
          { creator: req.user._id },
          { assignees: req.user._id },
        ],
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const overdue = await Task.countDocuments({
    deletedAt: null,
    dueDate: { $lt: new Date() },
    status: { $nin: ['done', 'cancelled'] },
    $or: [{ creator: userId }, { assignees: userId }],
  });

  const total = stats.reduce((acc, s) => acc + s.count, 0);
  const byStatus = {};
  stats.forEach((s) => {
    byStatus[s._id] = s.count;
  });

  res.status(200).json({
    success: true,
    data: {
      total,
      byStatus,
      overdue,
    },
  });
});

/**
 * @desc    Change Task Status only
 * @route   PATCH /api/tasks/:id/status
 * @access  Private
 */
export const changeTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = await Task.findOne({ _id: req.params.id, deletedAt: null });

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  task.status = status;
  await task.save();

  const populated = await Task.findById(task._id)
    .populate('creator', 'name email avatar')
    .populate('assignees', 'name email avatar')
    .populate('labels', 'name color')
    .populate('project', 'name color')
    .lean();

  res.status(200).json({
    success: true,
    data: populated,
    message: 'Task status updated.',
  });
});

/**
 * @desc    Assign/Unassign users to task
 * @route   PATCH /api/tasks/:id/assign
 * @access  Private
 */
export const assignTaskUsers = asyncHandler(async (req, res) => {
  const { assignees } = req.body;
  const task = await Task.findOne({ _id: req.params.id, deletedAt: null });

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  task.assignees = assignees;
  await task.save();

  const populated = await Task.findById(task._id)
    .populate('creator', 'name email avatar')
    .populate('assignees', 'name email avatar')
    .populate('labels', 'name color')
    .populate('project', 'name color')
    .lean();

  res.status(200).json({
    success: true,
    data: populated,
    message: 'Task assignees updated.',
  });
});
