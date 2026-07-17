import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { createRepost, type NewRepostInput, type Post } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { appendToLists, buildOptimisticPost, restoreLists, snapshotLists } from "@/lib/optimistic";

const feedKey = [...queryKeys.posts.all, "list"];

export function useCreateRepost(postId: string) {
  const queryClient = useQueryClient();
  const repostsKey: QueryKey = [...queryKeys.posts.all, postId, "reposts"];
  const detailKey = queryKeys.posts.detail(postId);

  return useMutation({
    mutationFn: (input: NewRepostInput) => createRepost(postId, input),
    onMutate: async (input: NewRepostInput) => {
      await queryClient.cancelQueries({ queryKey: detailKey });
      await queryClient.cancelQueries({ queryKey: repostsKey });
      await queryClient.cancelQueries({ queryKey: feedKey });

      const previousDetail = queryClient.getQueryData<Post>(detailKey);
      const repostsSnapshot = snapshotLists(queryClient, repostsKey);
      const feedSnapshot = snapshotLists(queryClient, feedKey);

      queryClient.setQueryData<Post>(detailKey, (current) =>
        current ? { ...current, repostsCount: current.repostsCount + 1 } : current,
      );

      const optimisticRepost = buildOptimisticPost(
        { championId: input.championId, content: "" },
        { repostOf: postId },
      );
      appendToLists(queryClient, repostsSnapshot, optimisticRepost);
      // A repost is also a standalone root post, so it shows up in feeds too.
      appendToLists(queryClient, feedSnapshot, optimisticRepost, (key) => {
        const params = (key[2] ?? {}) as { championId?: string };
        return !params.championId || params.championId === input.championId;
      });

      return { previousDetail, repostsSnapshot, feedSnapshot };
    },
    onError: (_error, _input, context) => {
      if (!context) return;
      if (context.previousDetail) queryClient.setQueryData(detailKey, context.previousDetail);
      restoreLists(queryClient, context.repostsSnapshot);
      restoreLists(queryClient, context.feedSnapshot);
    },
    onSettled: (repost) => {
      queryClient.invalidateQueries({ queryKey: detailKey });
      queryClient.invalidateQueries({ queryKey: repostsKey });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      if (repost) {
        queryClient.invalidateQueries({ queryKey: queryKeys.champions.posts(repost.championId) });
      }
    },
  });
}
