import { z } from 'zod';
import { PROJECT_ROLE_VALUES } from '../utils/constants.js';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100).trim(),
  description: z.string().max(2000).optional().default(''),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/, 'Color must be a valid hex code')
    .optional()
    .default('#6366f1'),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  description: z.string().max(2000).optional(),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/, 'Color must be a valid hex code')
    .optional(),
  isArchived: z.boolean().optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  role: z.enum(PROJECT_ROLE_VALUES.filter((r) => r !== 'owner')).optional().default('member'),
});

export const changeMemberRoleSchema = z.object({
  role: z.enum(PROJECT_ROLE_VALUES.filter((r) => r !== 'owner'), {
    errorMap: () => ({ message: 'Invalid role. Must be admin, member, or viewer.' }),
  }),
});

export const createLabelSchema = z.object({
  name: z.string().min(1, 'Label name is required').max(50).trim(),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/, 'Color must be a valid hex code')
    .optional()
    .default('#6366f1'),
});

export const updateLabelSchema = z.object({
  name: z.string().min(1).max(50).trim().optional(),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/, 'Color must be a valid hex code')
    .optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(2000).trim(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(2000).trim(),
});
