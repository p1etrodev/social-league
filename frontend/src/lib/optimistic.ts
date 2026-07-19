import type { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
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
    repostsCount: 0,
  };
}

type InfinitePostList = InfiniteData<PostList>;
type ListSnapshot = [QueryKey, InfinitePostList | undefined][];

/** Snapshot every cached (infinite) list matching a key prefix, for rollback
 * on error. */
export function snapshotLists(queryClient: QueryClient, keyPrefix: QueryKey): ListSnapshot {
  return queryClient.getQueriesData<InfinitePostList>({ queryKey: keyPrefix });
}

export function restoreLists(queryClient: QueryClient, snapshot: ListSnapshot) {
  for (const [key, data] of snapshot) {
    queryClient.setQueryData(key, data);
  }
}

/**
 * Prepend an optimistic post to every snapshotted list's first page, unless
 * `shouldInclude` rejects it (used to skip filtered lists the post wouldn't
 * actually appear in, e.g. a champion-filtered feed for a different
 * champion). Prepended, not appended, because every list endpoint on the
 * backend orders by created_at descending (newest first).
 */
export function appendToLists(
  queryClient: QueryClient,
  snapshot: ListSnapshot,
  post: Post,
  shouldInclude: (key: QueryKey) => boolean = () => true,
) {
  for (const [key] of snapshot) {
    if (!shouldInclude(key)) continue;
    queryClient.setQueryData<InfinitePostList>(key, (current) => {
      if (!current) return current;
      const [firstPage, ...restPages] = current.pages;
      return {
        ...current,
        pages: [
          { posts: [post, ...firstPage.posts], count: firstPage.count + 1 },
          ...restPages,
        ],
      };
    });
  }
}
