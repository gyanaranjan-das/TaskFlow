import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskList from '../components/tasks/TaskList';
import TaskFilters from '../components/tasks/TaskFilters';
import Button from '../components/ui/Button';
import { useUIStore } from '../store/uiStore';
import { cn } from '../utils/helpers';

const pageVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

/**
 * Tasks page with kanban/list toggle and filters
 */
const Tasks = () => {
  const { viewMode, setViewMode, openCreateModal } = useUIStore();
  const [filters, setFilters] = useState({});

  const { data, isLoading } = useTasks(filters);
  const tasks = data?.data || [];

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Tasks</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {data?.pagination?.total || 0} tasks total
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-lg bg-surface-100 dark:bg-surface-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                'p-2 rounded-md transition-all',
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-surface-700 shadow-sm text-primary-600'
                  : 'text-surface-400 hover:text-surface-600'
              )}
              title="Kanban View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-all',
                viewMode === 'list'
                  ? 'bg-white dark:bg-surface-700 shadow-sm text-primary-600'
                  : 'text-surface-400 hover:text-surface-600'
              )}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button onClick={openCreateModal} className="gap-2">
            <Plus className="w-4 h-4" /> New Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onFilterChange={setFilters} />

      {/* View */}
      {viewMode === 'kanban' ? (
        <KanbanBoard tasks={tasks} isLoading={isLoading} />
      ) : (
        <TaskList tasks={tasks} isLoading={isLoading} />
      )}
    </motion.div>
  );
};

export default Tasks;
