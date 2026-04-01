import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckSquare, XCircle, X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useBulkUpdateTasks } from '../../hooks/useTasks';
import Button from '../ui/Button';
import { toast } from '../ui/Toast';
import { STATUS } from '../../utils/constants';

/**
 * Floating bar for bulk task actions
 */
const BulkActions = () => {
  const { selectedTasks, clearSelectedTasks } = useUIStore();
  const bulkUpdateMutation = useBulkUpdateTasks();

  const handleBulkAction = (action, value) => {
    if (selectedTasks.length === 0) return;

    let update = {};
    if (action === 'status') {
      update.status = value;
    } else if (action === 'delete') {
      update.deletedAt = new Date().toISOString(); 
    }

    bulkUpdateMutation.mutate(
      { taskIds: selectedTasks, update },
      {
        onSuccess: () => {
          toast.success(`${selectedTasks.length} tasks updated.`);
          clearSelectedTasks();
        },
        onError: () => {
          toast.error('Failed to update tasks.');
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {selectedTasks.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3 bg-white dark:bg-surface-800 shadow-xl rounded-full border border-surface-200 dark:border-surface-700"
        >
          <div className="flex items-center gap-2 pr-4 border-r border-surface-200 dark:border-surface-700">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-xs font-bold">
              {selectedTasks.length}
            </span>
            <span className="text-sm font-medium text-surface-600 dark:text-surface-300">
              Selected
            </span>
            <button
              onClick={clearSelectedTasks}
              className="p-1 ml-1 rounded-full text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleBulkAction('status', STATUS.DONE)}
              className="gap-2"
              isLoading={bulkUpdateMutation.isPending}
            >
              <CheckSquare className="w-4 h-4 text-emerald-500" />
              Mark Done
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleBulkAction('status', STATUS.TODO)}
              className="gap-2"
              isLoading={bulkUpdateMutation.isPending}
            >
              <XCircle className="w-4 h-4 text-amber-500" />
              Mark To-Do
            </Button>

            <Button
              variant="danger"
              size="sm"
              onClick={() => handleBulkAction('delete')}
              className="gap-2"
              isLoading={bulkUpdateMutation.isPending}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActions;
