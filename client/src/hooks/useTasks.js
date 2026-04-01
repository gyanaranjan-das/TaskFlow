import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as tasksApi from '../api/tasks';

/**
 * Hook to fetch tasks with filters
 */
export function useTasks(filters = {}) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksApi.getTasks(filters),
  });
}

/**
 * Hook to fetch a single task
 */
export function useTask(id) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksApi.getTask(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch task stats
 */
export function useTaskStats() {
  return useQuery({
    queryKey: ['taskStats'],
    queryFn: tasksApi.getTaskStats,
  });
}

/**
 * Hook to create a task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
    },
  });
}

/**
 * Hook to update a task with optimistic updates
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => tasksApi.updateTask(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueriesData({ queryKey: ['tasks'] });

      queryClient.setQueriesData({ queryKey: ['tasks'] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((task) =>
            task._id === id ? { ...task, ...updates } : task
          ),
        };
      });

      return { previousTasks };
    },
    onError: (err, vars, context) => {
      context?.previousTasks?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
    },
  });
}

/**
 * Hook to delete (soft) a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
    },
  });
}

/**
 * Hook to reorder tasks (kanban drag-and-drop)
 */
export function useReorderTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tasksApi.reorderTasks,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/**
 * Hook to add a subtask
 */
export function useAddSubtask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, title }) => tasksApi.addSubtask(taskId, title),
    onSuccess: (data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/**
 * Hook to toggle subtask
 */
export function useToggleSubtask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, subtaskId }) => tasksApi.toggleSubtask(taskId, subtaskId),
    onSuccess: (data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
  });
}

/**
 * Hook to bulk update tasks
 */
export function useBulkUpdateTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskIds, update }) => tasksApi.bulkUpdateTasks(taskIds, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
    },
  });
}
