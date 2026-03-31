import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as labelsApi from '../api/labels';

export function useLabels() {
  return useQuery({
    queryKey: ['labels'],
    queryFn: labelsApi.getLabels,
  });
}

export function useCreateLabel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: labelsApi.createLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
    },
  });
}

export function useDeleteLabel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: labelsApi.deleteLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
    },
  });
}
