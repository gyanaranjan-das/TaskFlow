import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as projectsApi from '../api/projects';

export function useProjects(params = {}) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectsApi.getProjects(params),
  });
}

export function useProject(id) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getProject(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => projectsApi.updateProject(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberData }) =>
      projectsApi.inviteMember(projectId, memberData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
