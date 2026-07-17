import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { createQuote, type NewPostInput, type Post } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { appendToLists, buildOptimisticPost, restoreLists, snapshotLists } from "@/lib/optimistic";

const feedKey = [...queryKeys.posts.all, "list"];

export function useCreateQuote(postId: string) {
  const queryClient = useQueryClient();
  const quotesKey: QueryKey = [...queryKeys.posts.all, postId, "quotes"];
  const detailKey = queryKeys.posts.detail(postId);

  return useMutation({
    mutationFn: (input: NewPostInput) => createQuote(postId, input),
    onMutate: async (input: NewPostInput) => {
      await queryClient.cancelQueries({ queryKey: detailKey });
      await queryClient.cancelQueries({ queryKey: quotesKey });
      await queryClient.cancelQueries({ queryKey: feedKey });

      const previousDetail = queryClient.getQueryData<Post>(detailKey);
      const quotesSnapshot = snapshotLists(queryClient, quotesKey);
      const feedSnapshot = snapshotLists(queryClient, feedKey);

      queryClient.setQueryData<Post>(detailKey, (current) =>
        current ? { ...current, quotesCount: current.quotesCount + 1 } : current,
      );

      const optimisticQuote = buildOptimisticPost(input, { quoteOf: postId });
      appendToLists(queryClient, quotesSnapshot, optimisticQuote);
      // A quote is also a standalone root post, so it shows up in feeds too.
      appendToLists(queryClient, feedSnapshot, optimisticQuote, (key) => {
        const params = (key[2] ?? {}) as { championId?: string };
        return !params.championId || params.championId === input.championId;
      });

      return { previousDetail, quotesSnapshot, feedSnapshot };
    },
    onError: (_error, _input, context) => {
      if (!context) return;
      if (context.previousDetail) queryClient.setQueryData(detailKey, context.previousDetail);
      restoreLists(queryClient, context.quotesSnapshot);
      restoreLists(queryClient, context.feedSnapshot);
    },
    onSettled: (quote) => {
      queryClient.invalidateQueries({ queryKey: detailKey });
      queryClient.invalidateQueries({ queryKey: quotesKey });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      if (quote) {
        queryClient.invalidateQueries({ queryKey: queryKeys.champions.posts(quote.championId) });
      }
    },
  });
}
