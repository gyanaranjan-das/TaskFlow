/**
 * Application-wide constants (mirrors server constants)
 */

export const STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  DONE: 'done',
  CANCELLED: 'cancelled',
};

export const STATUS_LABELS = {
  [STATUS.TODO]: 'To Do',
  [STATUS.IN_PROGRESS]: 'In Progress',
  [STATUS.IN_REVIEW]: 'In Review',
  [STATUS.DONE]: 'Done',
  [STATUS.CANCELLED]: 'Cancelled',
};

export const STATUS_COLORS = {
  [STATUS.TODO]: 'bg-surface-400',
  [STATUS.IN_PROGRESS]: 'bg-primary-500',
  [STATUS.IN_REVIEW]: 'bg-warning-500',
  [STATUS.DONE]: 'bg-success-500',
  [STATUS.CANCELLED]: 'bg-surface-300',
};

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const PRIORITY_LABELS = {
  [PRIORITY.LOW]: 'Low',
  [PRIORITY.MEDIUM]: 'Medium',
  [PRIORITY.HIGH]: 'High',
  [PRIORITY.URGENT]: 'Urgent',
};

export const PRIORITY_COLORS = {
  [PRIORITY.LOW]: 'text-surface-400 border-surface-300',
  [PRIORITY.MEDIUM]: 'text-primary-500 border-primary-400',
  [PRIORITY.HIGH]: 'text-warning-500 border-warning-400',
  [PRIORITY.URGENT]: 'text-danger-500 border-danger-400',
};

export const PRIORITY_BG = {
  [PRIORITY.LOW]: 'bg-surface-100 dark:bg-surface-700',
  [PRIORITY.MEDIUM]: 'bg-primary-50 dark:bg-primary-950',
  [PRIORITY.HIGH]: 'bg-warning-50 dark:bg-warning-950',
  [PRIORITY.URGENT]: 'bg-danger-50 dark:bg-danger-950',
};

export const KANBAN_COLUMNS = [
  { id: STATUS.TODO, title: 'To Do' },
  { id: STATUS.IN_PROGRESS, title: 'In Progress' },
  { id: STATUS.IN_REVIEW, title: 'In Review' },
  { id: STATUS.DONE, title: 'Done' },
];
