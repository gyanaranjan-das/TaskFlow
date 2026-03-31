import { cn } from '../../utils/helpers';

const badgeVariants = {
  default: 'bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
  success: 'bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-400',
  danger: 'bg-danger-100 text-danger-700 dark:bg-danger-900/50 dark:text-danger-400',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900/50 dark:text-warning-400',
};

/**
 * Badge / pill component
 */
const Badge = ({ children, variant = 'default', className, ...props }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
