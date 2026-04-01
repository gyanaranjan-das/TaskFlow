import { useRef } from 'react';
import { Paperclip, Trash2, Download, UploadCloud } from 'lucide-react';
import { useAddAttachment, useDeleteAttachment } from '../../hooks/useTasks';
import Button from '../ui/Button';
import { toast } from '../ui/Toast';

const TaskAttachments = ({ task }) => {
  const fileInputRef = useRef(null);
  const addMutation = useAddAttachment();
  const deleteMutation = useDeleteAttachment();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 5MB limit check matching backend
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    addMutation.mutate(
      { taskId: task._id, file },
      {
        onSuccess: () => {
          toast.success('File uploaded successfully');
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
        onError: () => toast.error('Failed to upload file'),
      }
    );
  };

  const handleDelete = (attachmentId) => {
    if (confirm('Are you sure you want to delete this attachment?')) {
      deleteMutation.mutate(
        { taskId: task._id, attachmentId },
        {
          onSuccess: () => toast.success('Attachment deleted'),
          onError: () => toast.error('Failed to delete attachment'),
        }
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-surface-900 dark:text-white">
          <Paperclip className="w-4 h-4" />
          Attachments ({task.attachments?.length || 0})
        </h4>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => fileInputRef.current?.click()}
          isLoading={addMutation.isPending}
        >
          <UploadCloud className="w-3.5 h-3.5" /> Upload
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {task.attachments?.map((attachment) => (
          <div
            key={attachment._id}
            className="group relative flex items-center gap-3 p-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <div className="w-10 h-10 shrink-0 rounded bg-surface-200 dark:bg-surface-700 flex items-center justify-center overflow-hidden">
              {attachment.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Paperclip className="w-5 h-5 text-surface-500" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-surface-900 dark:text-white truncate" title={attachment.name}>
                {attachment.name}
              </p>
              <p className="text-[10px] text-surface-500">
                {(attachment.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <div className="absolute right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-50 dark:bg-surface-800 rounded">
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-surface-500 hover:text-primary-600 transition-colors"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleDelete(attachment._id)}
                className="p-1.5 text-surface-500 hover:text-danger-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {(!task.attachments || task.attachments.length === 0) && (
          <div className="col-span-2 py-4 text-center border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg">
            <p className="text-xs text-surface-400">No attachments yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskAttachments;
