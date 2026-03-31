import { motion } from 'framer-motion';
import TaskCard from './TaskCard';
import { TaskCardSkeleton } from '../ui/Skeleton';
import EmptyState from '../shared/EmptyState';
import { useUIStore } from '../../store/uiStore';

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Task list view (alternative to Kanban)
 */
const TaskList = ({ tasks = [], isLoading }) => {
  const { openCreateModal } = useUIStore();

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon="tasks"
        title="No tasks found"
        description="Create your first task to get started, or adjust your filters."
        actionLabel="Create Task"
        onAction={openCreateModal}
      />
    );
  }

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {tasks.map((task) => (
        <motion.div key={task._id} variants={itemVariants}>
          <TaskCard task={task} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TaskList;
