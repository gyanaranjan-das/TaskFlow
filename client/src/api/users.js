import api from './axios';

export const getProfile = async () => {
  const { data } = await api.get('/users/profile');
  return data;
};

export const updateProfile = async (updates) => {
  const { data } = await api.patch('/users/profile', updates);
  return data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const { data } = await api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const changePassword = async (passwords) => {
  const { data } = await api.patch('/users/password', passwords);
  return data;
};

export const searchUsers = async (query) => {
  const { data } = await api.get('/users/search', { params: { q: query } });
  return data;
};
