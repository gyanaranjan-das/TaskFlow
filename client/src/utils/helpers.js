import { clsx } from 'clsx';

/**
 * Merge class names conditionally
 * @param  {...any} inputs - Class names
 * @returns {string}
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Format date for display
 * @param {string|Date} date
 * @param {Object} options
 * @returns {string}
 */
export function formatDate(date, options = {}) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: options.year ? 'numeric' : undefined,
    ...options,
  });
}

/**
 * Format relative time (e.g. "2 hours ago")
 */
export function timeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const d = new Date(date);
  const seconds = Math.floor((now - d) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

/**
 * Get initials from name
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Check if a date is overdue
 */
export function isOverdue(date) {
  if (!date) return false;
  return new Date(date) < new Date();
}

/**
 * Check if a date is due soon (within 2 days)
 */
export function isDueSoon(date) {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();
  const diff = d - now;
  return diff > 0 && diff < 2 * 24 * 60 * 60 * 1000;
}
