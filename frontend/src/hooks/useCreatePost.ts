import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, type NewPostInput } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { appendToLists, buildOptimisticPost, restoreLists, snapshotLists } from "@/lib/optimistic";

const listsKey = [...queryKeys.posts.all, "list"];

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewPostInput) => createPost(input),
    onMutate: async (input: NewPostInput) => {
      await queryClient.cancelQueries({ queryKey: listsKey });

      const snapshot = snapshotLists(queryClient, listsKey);
      const optimisticPost = buildOptimisticPost(input);

      appendToLists(queryClient, snapshot, optimisticPost, (key) => {
        const params = (key[2] ?? {}) as { championId?: string };
        return !params.championId || params.championId === input.championId;
      });

      return { snapshot };
    },
    onError: (_error, _input, context) => {
      if (context) restoreLists(queryClient, context.snapshot);
    },
    onSettled: (post) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      if (post) {
        queryClient.invalidateQueries({ queryKey: queryKeys.champions.posts(post.championId) });
      }
    },
  });
}
