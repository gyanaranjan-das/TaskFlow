import React from 'react';
import { cn } from '../../utils/helpers';

/**
 * Reusable Input component with label and error state
 */
const Input = React.forwardRef(({ className, label, error, id, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'input-field',
          error && 'border-danger-500 focus:ring-danger-500/50 focus:border-danger-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger-500 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
