import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchTrendingPosts } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function trendingPostsQueryOptions(params?: { hours?: number; limit?: number }) {
  return queryOptions({
    queryKey: queryKeys.posts.trending(params),
    queryFn: () => fetchTrendingPosts(params),
  });
}

export function useTrendingPosts(params?: { hours?: number; limit?: number }) {
  return useQuery(trendingPostsQueryOptions(params));
}
