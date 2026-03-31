import api from './axios';

export const getTasks = async (params = {}) => {
  const { data } = await api.get('/tasks', { params });
  return data;
};

export const getTask = async (id) => {
  const { data } = await api.get(`/tasks/${id}`);
  return data;
};

export const createTask = async (taskData) => {
  const { data } = await api.post('/tasks', taskData);
  return data;
};

export const updateTask = async (id, updates) => {
  const { data } = await api.patch(`/tasks/${id}`, updates);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};

export const restoreTask = async (id) => {
  const { data } = await api.patch(`/tasks/${id}/restore`);
  return data;
};

export const bulkUpdateTasks = async (taskIds, update) => {
  const { data } = await api.patch('/tasks/bulk', { taskIds, update });
  return data;
};

export const reorderTasks = async (tasks) => {
  const { data } = await api.patch('/tasks/reorder', { tasks });
  return data;
};

export const getTaskStats = async () => {
  const { data } = await api.get('/tasks/stats');
  return data;
};

// Subtasks
export const addSubtask = async (taskId, title) => {
  const { data } = await api.post(`/tasks/${taskId}/subtasks`, { title });
  return data;
};

export const toggleSubtask = async (taskId, subtaskId) => {
  const { data } = await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`);
  return data;
};

export const deleteSubtask = async (taskId, subtaskId) => {
  const { data } = await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
  return data;
};

// Attachments
export const addAttachment = async (taskId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(`/tasks/${taskId}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteAttachment = async (taskId, attachmentId) => {
  const { data } = await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
  return data;
};
