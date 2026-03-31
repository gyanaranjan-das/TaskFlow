import api from './axios';

export const getLabels = async () => {
  const { data } = await api.get('/labels');
  return data;
};

export const createLabel = async (labelData) => {
  const { data } = await api.post('/labels', labelData);
  return data;
};

export const updateLabel = async (id, updates) => {
  const { data } = await api.patch(`/labels/${id}`, updates);
  return data;
};

export const deleteLabel = async (id) => {
  const { data } = await api.delete(`/labels/${id}`);
  return data;
};
