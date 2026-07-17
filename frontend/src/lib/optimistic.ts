import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { NewPostInput, Post, PostList } from "./api";

export function buildOptimisticPost(
  input: NewPostInput,
  overrides: Partial<Pick<Post, "responseOf" | "quoteOf" | "repostOf">> = {},
): Post {
  return {
    id: `optimistic-${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
    championId: input.championId,
    content: input.content,
    responseOf: overrides.responseOf ?? null,
    quoteOf: overrides.quoteOf ?? null,
    repostOf: overrides.repostOf ?? null,
    responsesCount: 0,
    quotesCount: 0,
  };
}

type ListSnapshot = [QueryKey, PostList | undefined][];

/** Snapshot every cached list matching a key prefix, for rollback on error. */
export function snapshotLists(queryClient: QueryClient, keyPrefix: QueryKey): ListSnapshot {
  return queryClient.getQueriesData<PostList>({ queryKey: keyPrefix });
}

export function restoreLists(queryClient: QueryClient, snapshot: ListSnapshot) {
  for (const [key, data] of snapshot) {
    queryClient.setQueryData(key, data);
  }
}

/**
 * Append an optimistic post to every snapshotted list, unless `shouldInclude`
 * rejects it (used to skip filtered lists the post wouldn't actually appear
 * in, e.g. a champion-filtered feed for a different champion). Appended, not
 * prepended, because every list endpoint on the backend orders by
 * created_at ascending.
 */
export function appendToLists(
  queryClient: QueryClient,
  snapshot: ListSnapshot,
  post: Post,
  shouldInclude: (key: QueryKey) => boolean = () => true,
) {
  for (const [key] of snapshot) {
    if (!shouldInclude(key)) continue;
    queryClient.setQueryData<PostList>(key, (current) =>
      current ? { posts: [...current.posts, post], count: current.count + 1 } : current,
    );
  }
}
