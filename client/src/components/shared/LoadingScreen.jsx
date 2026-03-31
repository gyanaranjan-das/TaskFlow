import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Full-screen loading spinner
 */
const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-50 dark:bg-surface-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-7 h-7 text-white">
              <path
                d="M9 16.5L13.5 21L23 11"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <Loader2 className="absolute -bottom-1 -right-1 w-5 h-5 text-primary-400 animate-spin" />
        </div>
        <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">
          Loading TaskFlow...
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
