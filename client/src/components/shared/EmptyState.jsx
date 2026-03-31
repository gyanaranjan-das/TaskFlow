import { motion } from 'framer-motion';
import { ClipboardList, FolderOpen, Tag, Search } from 'lucide-react';
import Button from '../ui/Button';

const illustrations = {
  tasks: ClipboardList,
  projects: FolderOpen,
  labels: Tag,
  search: Search,
};

/**
 * Empty state component with illustration, heading, and CTA
 */
const EmptyState = ({
  icon = 'tasks',
  title = 'Nothing here yet',
  description = 'Get started by creating your first item.',
  actionLabel,
  onAction,
}) => {
  const Icon = illustrations[icon] || ClipboardList;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-primary-500" />
      </div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-surface-500 dark:text-surface-400 max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
