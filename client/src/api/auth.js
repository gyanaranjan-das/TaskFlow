import api from './axios';

export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const refreshToken = async () => {
  const { data } = await api.post('/auth/refresh');
  return data;
};

export const verifyEmail = async (token) => {
  const { data } = await api.get(`/auth/verify-email/${token}`);
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await api.post(`/auth/reset-password/${token}`, { password });
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};
