import React from 'react';
import { cn } from '../../utils/helpers';

/**
 * Textarea component with label and error state
 */
const Textarea = React.forwardRef(({ className, label, error, id, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={cn(
          'input-field min-h-[80px] resize-y',
          error && 'border-danger-500 focus:ring-danger-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
