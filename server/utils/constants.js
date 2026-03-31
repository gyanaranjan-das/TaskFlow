/**
 * Application-wide constants
 * No hardcoded strings — use these enums everywhere
 */

export const STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  DONE: 'done',
  CANCELLED: 'cancelled',
};

export const STATUS_VALUES = Object.values(STATUS);

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const PRIORITY_VALUES = Object.values(PRIORITY);

export const USER_ROLE = {
  USER: 'user',
  ADMIN: 'admin',
};

export const USER_ROLE_VALUES = Object.values(USER_ROLE);

export const PROJECT_ROLE = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
};

export const PROJECT_ROLE_VALUES = Object.values(PROJECT_ROLE);

export const SORT_FIELDS = {
  CREATED_AT: 'createdAt',
  DUE_DATE: 'dueDate',
  PRIORITY: 'priority',
  POSITION: 'position',
  UPDATED_AT: 'updatedAt',
};

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

export const THEME_VALUES = Object.values(THEME);

export const BCRYPT_ROUNDS = 12;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};
