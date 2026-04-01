import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as commentsApi from '../api/comments';

export function useComments(taskId) {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => commentsApi.getComments(taskId),
    enabled: !!taskId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, content }) => commentsApi.createComment(taskId, content),
    onSuccess: (data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId }) => commentsApi.deleteComment(commentId),
    onSuccess: (data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}
