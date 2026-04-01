import { motion } from 'framer-motion';
import { Calendar, MoreHorizontal, Paperclip, MessageSquare } from 'lucide-react';
import { cn, formatDate, isOverdue, isDueSoon } from '../../utils/helpers';
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_LABELS } from '../../utils/constants';
import { AvatarGroup } from '../ui/Avatar';
import Badge from '../ui/Badge';
import DropdownMenu, { DropdownItem } from '../ui/DropdownMenu';
import { useUIStore } from '../../store/uiStore';
import { useDeleteTask } from '../../hooks/useTasks';
import { toast } from '../ui/Toast';
import { Trash2, Edit, Eye } from 'lucide-react';

const priorityBorders = {
  low: 'border-l-surface-300 dark:border-l-surface-600',
  medium: 'border-l-primary-400',
  high: 'border-l-warning-400',
  urgent: 'border-l-danger-500',
};

/**
 * Task card component for kanban and list views
 */
const TaskCard = ({ task, isDragging, provided }) => {
  const { openDrawer, selectedTasks, toggleTaskSelection } = useUIStore();
  const deleteMutation = useDeleteTask();

  const isSelected = selectedTasks.includes(task._id);

  const subtaskProgress = task.subtasks?.length
    ? Math.round((task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100)
    : null;

  const handleDelete = () => {
    deleteMutation.mutate(task._id, {
      onSuccess: () => toast.success('Task deleted'),
      onError: () => toast.error('Failed to delete task'),
    });
  };

  return (
    <motion.div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.1)' }}
      className={cn(
        'group relative bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4 cursor-pointer border-l-[3px] transition-all duration-200',
        priorityBorders[task.priority],
        isDragging && 'shadow-2xl rotate-[2deg] scale-105',
        isSelected && 'ring-2 ring-primary-500 border-transparent dark:border-transparent'
      )}
      onClick={() => openDrawer(task._id)}
    >
      {/* Checkbox for bulk actions */}
      <div 
        className={cn(
          "absolute -left-3 -top-3 z-10 p-1 bg-white dark:bg-surface-800 rounded-full shadow-sm border border-surface-200 dark:border-surface-700 transition-opacity",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        onClick={(e) => {
          e.stopPropagation();
          toggleTaskSelection(task._id);
        }}
      >
        <div className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
          isSelected ? "bg-primary-500 border-primary-500 text-white" : "border-surface-300 dark:border-surface-600 hover:border-primary-400"
        )}>
          {isSelected && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
        </div>
      </div>
      {/* Header: labels + menu */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap gap-1">
          {task.labels?.slice(0, 3).map((label) => (
            <span
              key={label._id}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
        <DropdownMenu
          trigger={
            <button
              className="p-1 rounded-md text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          }
        >
          <DropdownItem onClick={() => openDrawer(task._id)}>
            <Eye className="w-4 h-4" /> View Details
          </DropdownItem>
          <DropdownItem onClick={handleDelete} danger>
            <Trash2 className="w-4 h-4" /> Delete
          </DropdownItem>
        </DropdownMenu>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-surface-900 dark:text-white line-clamp-2 mb-2">
        {task.title}
      </h4>

      {/* Subtask progress */}
      {subtaskProgress !== null && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-surface-500 mb-1">
            <span>Subtasks</span>
            <span>{task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}</span>
          </div>
          <div className="w-full h-1.5 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-300"
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer: assignees, due date, priority */}
      <div className="flex items-center justify-between mt-3">
        <AvatarGroup users={task.assignees || []} max={3} size="xs" />

        <div className="flex items-center gap-2">
          {task.attachments?.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-surface-400">
              <Paperclip className="w-3 h-3" /> {task.attachments.length}
            </span>
          )}
          {task.dueDate && (
            <span
              className={cn(
                'flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md',
                isOverdue(task.dueDate)
                  ? 'bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400'
                  : isDueSoon(task.dueDate)
                    ? 'bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400'
                    : 'bg-surface-100 text-surface-500 dark:bg-surface-700 dark:text-surface-400'
              )}
            >
              <Calendar className="w-3 h-3" />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
