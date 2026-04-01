import { Router } from 'express';
import {
  getTasks, getTask, createTask, updateTask, deleteTask,
  restoreTask, bulkUpdateTasks, reorderTasks,
  addSubtask, toggleSubtask, deleteSubtask,
  addAttachment, deleteAttachment, getTaskStats,
  changeTaskStatus, assignTaskUsers,
} from '../controllers/taskController.js';
import { getComments, createComment } from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  addSubtaskSchema, reorderTasksSchema, taskQuerySchema,
  changeTaskStatusSchema, assignTaskSchema,
} from '../validations/task.schema.js';
import { createCommentSchema } from '../validations/project.schema.js';
import { uploadSingle } from '../middleware/upload.js';

const router = Router();

// All routes are protected
router.use(protect);

// Task stats (must be before :id routes)
router.get('/stats', getTaskStats);

// Bulk operations
router.patch('/bulk', validate(bulkUpdateSchema), bulkUpdateTasks);
router.patch('/reorder', validate(reorderTasksSchema), reorderTasks);

// CRUD
router.get('/', validate(taskQuerySchema, 'query'), getTasks);
router.post('/', validate(createTaskSchema), createTask);
router.get('/:id', getTask);
router.patch('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/restore', restoreTask);

// Specific fields update
router.patch('/:id/status', validate(changeTaskStatusSchema), changeTaskStatus);
router.patch('/:id/assign', validate(assignTaskSchema), assignTaskUsers);

// Subtasks
router.post('/:id/subtasks', validate(addSubtaskSchema), addSubtask);
router.patch('/:id/subtasks/:subtaskId', toggleSubtask);
router.delete('/:id/subtasks/:subtaskId', deleteSubtask);

// Attachments
router.post('/:id/attachments', uploadSingle, addAttachment);
router.delete('/:id/attachments/:attachmentId', deleteAttachment);

// Comments (nested under tasks)
router.get('/:taskId/comments', getComments);
router.post('/:taskId/comments', validate(createCommentSchema), createComment);

export default router;
