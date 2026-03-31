import { z } from 'zod';
import { STATUS_VALUES, PRIORITY_VALUES } from '../utils/constants.js';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).trim(),
  description: z.string().max(5000).optional().default(''),
  status: z.enum(STATUS_VALUES).optional().default('todo'),
  priority: z.enum(PRIORITY_VALUES).optional().default('medium'),
  dueDate: z.string().datetime().optional().nullable(),
  project: z.string().optional().nullable(),
  assignees: z.array(z.string()).optional().default([]),
  labels: z.array(z.string()).optional().default([]),
  subtasks: z
    .array(
      z.object({
        title: z.string().min(1).max(200).trim(),
        completed: z.boolean().optional().default(false),
      })
    )
    .optional()
    .default([]),
  position: z.number().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  description: z.string().max(5000).optional(),
  status: z.enum(STATUS_VALUES).optional(),
  priority: z.enum(PRIORITY_VALUES).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  project: z.string().optional().nullable(),
  assignees: z.array(z.string()).optional(),
  labels: z.array(z.string()).optional(),
  position: z.number().optional(),
});

export const bulkUpdateSchema = z.object({
  taskIds: z.array(z.string()).min(1, 'At least one task ID is required'),
  update: z.object({
    status: z.enum(STATUS_VALUES).optional(),
    priority: z.enum(PRIORITY_VALUES).optional(),
    assignees: z.array(z.string()).optional(),
    labels: z.array(z.string()).optional(),
    dueDate: z.string().datetime().optional().nullable(),
  }),
});

export const addSubtaskSchema = z.object({
  title: z.string().min(1, 'Subtask title is required').max(200).trim(),
});

export const reorderTasksSchema = z.object({
  tasks: z.array(
    z.object({
      id: z.string(),
      status: z.enum(STATUS_VALUES),
      position: z.number(),
    })
  ),
});

export const taskQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  status: z.string().optional(),
  priority: z.string().optional(),
  project: z.string().optional(),
  assignee: z.string().optional(),
  label: z.string().optional(),
  search: z.string().optional(),
  dueDateFrom: z.string().optional(),
  dueDateTo: z.string().optional(),
  sort: z.string().optional().default('-createdAt'),
});
