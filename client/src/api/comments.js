import api from './axios';

export const getComments = async (taskId) => {
  const { data } = await api.get(`/tasks/${taskId}/comments`);
  return data;
};

export const createComment = async (taskId, content) => {
  const { data } = await api.post(`/tasks/${taskId}/comments`, { content });
  return data;
};

export const updateComment = async (commentId, content) => {
  const { data } = await api.patch(`/comments/${commentId}`, { content });
  return data;
};

export const deleteComment = async (commentId) => {
  const { data } = await api.delete(`/comments/${commentId}`);
  return data;
};
