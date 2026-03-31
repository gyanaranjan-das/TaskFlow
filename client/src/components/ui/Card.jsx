import { cn } from '../../utils/helpers';

/**
 * Card component
 */
const Card = ({ children, className, onClick, ...props }) => {
  return (
    <div
      className={cn('card', onClick && 'cursor-pointer', className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => (
  <div className={cn('px-6 py-4 border-b border-surface-200 dark:border-surface-700', className)}>
    {children}
  </div>
);

export const CardContent = ({ children, className }) => (
  <div className={cn('px-6 py-4', className)}>{children}</div>
);

export default Card;
