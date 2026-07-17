import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { createResponse, type NewPostInput, type Post } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { appendToLists, buildOptimisticPost, restoreLists, snapshotLists } from "@/lib/optimistic";

export function useCreateResponse(postId: string) {
  const queryClient = useQueryClient();
  const responsesKey: QueryKey = [...queryKeys.posts.all, postId, "responses"];
  const detailKey = queryKeys.posts.detail(postId);

  return useMutation({
    mutationFn: (input: NewPostInput) => createResponse(postId, input),
    onMutate: async (input: NewPostInput) => {
      await queryClient.cancelQueries({ queryKey: detailKey });
      await queryClient.cancelQueries({ queryKey: responsesKey });

      const previousDetail = queryClient.getQueryData<Post>(detailKey);
      const responsesSnapshot = snapshotLists(queryClient, responsesKey);

      queryClient.setQueryData<Post>(detailKey, (current) =>
        current ? { ...current, responsesCount: current.responsesCount + 1 } : current,
      );

      const optimisticResponse = buildOptimisticPost(input, { responseOf: postId });
      appendToLists(queryClient, responsesSnapshot, optimisticResponse);

      return { previousDetail, responsesSnapshot };
    },
    onError: (_error, _input, context) => {
      if (!context) return;
      if (context.previousDetail) queryClient.setQueryData(detailKey, context.previousDetail);
      restoreLists(queryClient, context.responsesSnapshot);
    },
    onSettled: (response) => {
      queryClient.invalidateQueries({ queryKey: detailKey });
      queryClient.invalidateQueries({ queryKey: responsesKey });
      if (response) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.champions.responses(response.championId),
        });
      }
    },
  });
}
