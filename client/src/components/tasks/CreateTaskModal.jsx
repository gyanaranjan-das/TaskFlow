import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useCreateTask } from '../../hooks/useTasks';
import { useUIStore } from '../../store/uiStore';
import { toast } from '../ui/Toast';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().optional(),
});

/**
 * Create task modal with form
 */
const CreateTaskModal = () => {
  const { createModalOpen, closeCreateModal } = useUIStore();
  const createMutation = useCreateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      status: 'todo',
      priority: 'medium',
    },
  });

  const onSubmit = (data) => {
    const payload = { ...data };
    if (payload.dueDate) {
      payload.dueDate = new Date(payload.dueDate).toISOString();
    } else {
      delete payload.dueDate;
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Task created successfully!');
        reset();
        closeCreateModal();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create task');
      },
    });
  };

  return (
    <Modal isOpen={createModalOpen} onClose={closeCreateModal} title="Create New Task" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="task-title"
          label="Title"
          placeholder="Enter task title..."
          error={errors.title?.message}
          {...register('title')}
        />

        <Textarea
          id="task-description"
          label="Description"
          placeholder="Describe the task..."
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select id="task-status" label="Status" {...register('status')}>
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </Select>

          <Select id="task-priority" label="Priority" {...register('priority')}>
            {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </Select>
        </div>

        <Input
          id="task-dueDate"
          label="Due Date"
          type="date"
          {...register('dueDate')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
          <Button variant="secondary" type="button" onClick={closeCreateModal}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createMutation.isPending}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
