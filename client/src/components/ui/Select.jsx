import React from 'react';
import { cn } from '../../utils/helpers';

/**
 * Select component
 */
const Select = React.forwardRef(({ className, label, error, id, children, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          'input-field pr-10',
          error && 'border-danger-500 focus:ring-danger-500/50',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
