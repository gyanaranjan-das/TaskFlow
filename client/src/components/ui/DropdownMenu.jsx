import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers';

/**
 * Dropdown menu component
 */
const DropdownMenu = ({ trigger, children, align = 'right', className }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 mt-1 py-1 min-w-[160px] bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700',
              align === 'right' ? 'right-0' : 'left-0',
              className
            )}
          >
            <div onClick={() => setOpen(false)}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownItem = ({ children, onClick, className, danger }) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors',
      danger
        ? 'text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20'
        : 'text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700',
      className
    )}
  >
    {children}
  </button>
);

export default DropdownMenu;
