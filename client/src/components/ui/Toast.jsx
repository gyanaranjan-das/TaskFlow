import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../utils/helpers';

let toastId = 0;
let addToastFn = null;

/**
 * Imperative toast API
 */
export const toast = {
  success: (message) => addToastFn?.({ type: 'success', message }),
  error: (message) => addToastFn?.({ type: 'error', message }),
  warning: (message) => addToastFn?.({ type: 'warning', message }),
  info: (message) => addToastFn?.({ type: 'info', message }),
};

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'border-l-success-500 bg-success-50 dark:bg-success-500/10',
  error: 'border-l-danger-500 bg-danger-50 dark:bg-danger-500/10',
  warning: 'border-l-warning-500 bg-warning-50 dark:bg-warning-500/10',
  info: 'border-l-primary-500 bg-primary-50 dark:bg-primary-500/10',
};

const iconColors = {
  success: 'text-success-500',
  error: 'text-danger-500',
  warning: 'text-warning-500',
  info: 'text-primary-500',
};

/**
 * Toast container component - renders stacked notifications
 */
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToastFn = ({ type, message }) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    return () => { addToastFn = null; };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-lg backdrop-blur-sm',
                'border border-surface-200 dark:border-surface-700',
                colors[t.type]
              )}
            >
              <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', iconColors[t.type])} />
              <p className="text-sm text-surface-700 dark:text-surface-200 flex-1">
                {t.message}
              </p>
              <button
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                className="text-surface-400 hover:text-surface-600 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
