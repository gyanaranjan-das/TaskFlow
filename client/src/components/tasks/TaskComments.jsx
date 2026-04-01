import { useState } from 'react';
import { MessageSquare, MoreVertical, Trash2 } from 'lucide-react';
import { useComments, useCreateComment, useDeleteComment } from '../../hooks/useComments';
import { timeAgo } from '../../utils/helpers';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import DropdownMenu, { DropdownItem } from '../ui/DropdownMenu';
import Skeleton from '../ui/Skeleton';

const TaskComments = ({ taskId }) => {
  const { data, isLoading } = useComments(taskId);
  const createMutation = useCreateComment();
  const deleteMutation = useDeleteComment();
  const [newComment, setNewComment] = useState('');
  const { user } = useAuthStore();

  const comments = data?.data || [];

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    createMutation.mutate(
      { taskId, content: newComment.trim() },
      { onSuccess: () => setNewComment('') }
    );
  };

  const handleDeleteComment = (commentId) => {
    deleteMutation.mutate({ taskId, commentId });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-surface-900 dark:text-white mb-3">
          <MessageSquare className="w-4 h-4" /> Comments
        </h4>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h4 className="flex items-center gap-2 text-sm font-semibold text-surface-900 dark:text-white mb-3">
        <MessageSquare className="w-4 h-4" />
        Comments ({comments.length})
      </h4>

      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto scrollbar-thin pr-1">
        {comments.length === 0 ? (
          <p className="text-xs text-surface-400">No comments yet. Be the first to start the discussion!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="group flex gap-3">
              <Avatar
                src={comment.author?.avatar?.url}
                name={comment.author?.name}
                size="sm"
              />
              <div className="flex-1 bg-surface-50 dark:bg-surface-800/50 rounded-xl p-3 relative">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-surface-900 dark:text-white">
                      {comment.author?.name}
                    </span>
                    <span className="text-[10px] text-surface-400">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  {user?.id === comment.author?._id && (
                    <DropdownMenu
                      trigger={
                        <button className="opacity-0 group-hover:opacity-100 p-1 text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      }
                    >
                      <DropdownItem onClick={() => handleDeleteComment(comment._id)} danger>
                        <Trash2 className="w-4 h-4" /> Delete
                      </DropdownItem>
                    </DropdownMenu>
                  )}
                </div>
                <p className="text-sm text-surface-600 dark:text-surface-300">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddComment} className="flex gap-2">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="input-field text-sm flex-1"
        />
        <Button type="submit" size="sm" isLoading={createMutation.isPending} disabled={!newComment.trim()}>
          Post
        </Button>
      </form>
    </div>
  );
};

export default TaskComments;
