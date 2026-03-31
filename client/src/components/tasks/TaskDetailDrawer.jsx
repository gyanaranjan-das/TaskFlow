import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flag, User, Tag, CheckSquare, MessageSquare, Paperclip } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTask, useUpdateTask, useAddSubtask, useToggleSubtask } from '../../hooks/useTasks';
import { useComments, useCreateComment } from '../../hooks/useComments';
import { useUIStore } from '../../store/uiStore';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Skeleton from '../ui/Skeleton';
import { toast } from '../ui/Toast';
import { cn, formatDate, timeAgo } from '../../utils/helpers';
import { STATUS_LABELS, PRIORITY_LABELS, STATUS, PRIORITY } from '../../utils/constants';

const drawerVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring', damping: 28, stiffness: 300 } },
  exit: { x: '100%', transition: { duration: 0.2 } },
};

/**
 * Task detail drawer - slides in from right
 */
const TaskDetailDrawer = () => {
  const { selectedTaskId, drawerOpen, closeDrawer } = useUIStore();
  const { data: taskData, isLoading } = useTask(selectedTaskId);
  const { data: commentsData } = useComments(selectedTaskId);
  const updateMutation = useUpdateTask();
  const addSubtaskMutation = useAddSubtask();
  const toggleSubtaskMutation = useToggleSubtask();
  const createCommentMutation = useCreateComment();

  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');

  const task = taskData?.data;
  const comments = commentsData?.data || [];

  // Close on ESC
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    if (drawerOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [drawerOpen, closeDrawer]);

  const handleStatusChange = (status) => {
    updateMutation.mutate(
      { id: task._id, updates: { status } },
      { onSuccess: () => toast.success('Status updated') }
    );
  };

  const handlePriorityChange = (priority) => {
    updateMutation.mutate(
      { id: task._id, updates: { priority } },
      { onSuccess: () => toast.success('Priority updated') }
    );
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    addSubtaskMutation.mutate(
      { taskId: task._id, title: newSubtask.trim() },
      { onSuccess: () => setNewSubtask('') }
    );
  };

  const handleToggleSubtask = (subtaskId) => {
    toggleSubtaskMutation.mutate({ taskId: task._id, subtaskId });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    createCommentMutation.mutate(
      { taskId: task._id, content: newComment.trim() },
      { onSuccess: () => setNewComment('') }
    );
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white dark:bg-surface-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                Task Details
              </h2>
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : task ? (
                <>
                  {/* Title */}
                  <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                    {task.title}
                  </h3>

                  {/* Description */}
                  {task.description && (
                    <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  {/* Status & Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Status"
                      value={task.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                    >
                      {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </Select>

                    <Select
                      label="Priority"
                      value={task.priority}
                      onChange={(e) => handlePriorityChange(e.target.value)}
                    >
                      {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </Select>
                  </div>

                  {/* Meta info */}
                  <div className="space-y-3">
                    {task.dueDate && (
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-surface-400" />
                        <span className="text-surface-600 dark:text-surface-400">
                          Due: {formatDate(task.dueDate, { year: true })}
                        </span>
                      </div>
                    )}
                    {task.assignees?.length > 0 && (
                      <div className="flex items-center gap-3 text-sm">
                        <User className="w-4 h-4 text-surface-400" />
                        <div className="flex items-center gap-2 flex-wrap">
                          {task.assignees.map((a) => (
                            <div key={a._id} className="flex items-center gap-1.5">
                              <Avatar src={a.avatar?.url} name={a.name} size="xs" />
                              <span className="text-surface-600 dark:text-surface-400">{a.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {task.labels?.length > 0 && (
                      <div className="flex items-center gap-3 text-sm">
                        <Tag className="w-4 h-4 text-surface-400" />
                        <div className="flex flex-wrap gap-1">
                          {task.labels.map((l) => (
                            <span
                              key={l._id}
                              className="px-2 py-0.5 rounded-full text-xs text-white font-medium"
                              style={{ backgroundColor: l.color }}
                            >
                              {l.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Subtasks */}
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-surface-900 dark:text-white mb-3">
                      <CheckSquare className="w-4 h-4" />
                      Subtasks
                      {task.subtasks?.length > 0 && (
                        <span className="text-xs text-surface-400 font-normal">
                          ({task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length})
                        </span>
                      )}
                    </h4>

                    <div className="space-y-2">
                      {task.subtasks?.map((subtask) => (
                        <label
                          key={subtask._id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={() => handleToggleSubtask(subtask._id)}
                            className="rounded border-surface-300 text-primary-500 focus:ring-primary-500"
                          />
                          <span className={cn(
                            'text-sm',
                            subtask.completed && 'line-through text-surface-400'
                          )}>
                            {subtask.title}
                          </span>
                        </label>
                      ))}
                    </div>

                    <form onSubmit={handleAddSubtask} className="flex gap-2 mt-3">
                      <input
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        placeholder="Add a subtask..."
                        className="input-field text-sm flex-1"
                      />
                      <Button type="submit" size="sm" disabled={!newSubtask.trim()}>
                        Add
                      </Button>
                    </form>
                  </div>

                  {/* Comments */}
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-surface-900 dark:text-white mb-3">
                      <MessageSquare className="w-4 h-4" />
                      Comments ({comments.length})
                    </h4>

                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment._id} className="flex gap-3">
                          <Avatar
                            src={comment.author?.avatar?.url}
                            name={comment.author?.name}
                            size="sm"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-surface-900 dark:text-white">
                                {comment.author?.name}
                              </span>
                              <span className="text-xs text-surface-400">
                                {timeAgo(comment.createdAt)}
                              </span>
                              {comment.isEdited && (
                                <span className="text-xs text-surface-400">(edited)</span>
                              )}
                            </div>
                            <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
                      <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="input-field text-sm flex-1"
                      />
                      <Button type="submit" size="sm" disabled={!newComment.trim()}>
                        Send
                      </Button>
                    </form>
                  </div>
                </>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailDrawer;
