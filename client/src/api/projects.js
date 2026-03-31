import api from './axios';

export const getProjects = async (params = {}) => {
  const { data } = await api.get('/projects', { params });
  return data;
};

export const getProject = async (id) => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

export const createProject = async (projectData) => {
  const { data } = await api.post('/projects', projectData);
  return data;
};

export const updateProject = async (id, updates) => {
  const { data } = await api.patch(`/projects/${id}`, updates);
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};

export const inviteMember = async (projectId, memberData) => {
  const { data } = await api.post(`/projects/${projectId}/members`, memberData);
  return data;
};

export const changeMemberRole = async (projectId, userId, role) => {
  const { data } = await api.patch(`/projects/${projectId}/members/${userId}`, { role });
  return data;
};

export const removeMember = async (projectId, userId) => {
  const { data } = await api.delete(`/projects/${projectId}/members/${userId}`);
  return data;
};
