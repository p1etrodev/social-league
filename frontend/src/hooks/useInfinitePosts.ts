import { useInfiniteQuery, type InfiniteData, type QueryKey } from "@tanstack/react-query";
import type { ListParams, PostList } from "@/lib/api";

export const POSTS_PAGE_SIZE = 20;

/** Shared shape for every paginated post list (feed, quotes, responses,
 * reposts, champion tabs, ...) so they all get infinite scroll the same
 * way instead of each reinventing pagination. */
export function infinitePostsQueryOptions(
  queryKey: QueryKey,
  fetchPage: (params: ListParams) => Promise<PostList>,
) {
  return {
    queryKey,
    queryFn: ({ pageParam }: { pageParam: number }) =>
      fetchPage({ limit: POSTS_PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PostList, allPages: PostList[]) => {
      const loaded = allPages.reduce((sum, page) => sum + page.posts.length, 0);
      return loaded < lastPage.count ? loaded : undefined;
    },
  };
}

export function useInfinitePosts(
  queryKey: QueryKey,
  fetchPage: (params: ListParams) => Promise<PostList>,
) {
  return useInfiniteQuery(infinitePostsQueryOptions(queryKey, fetchPage));
}

export function flattenPosts(data: InfiniteData<PostList> | undefined) {
  return data ? data.pages.flatMap((page) => page.posts) : [];
}
