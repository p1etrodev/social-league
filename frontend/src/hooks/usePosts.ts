import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchPosts, type ListParams } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function postsQueryOptions(params?: ListParams & { championId?: string }) {
  return queryOptions({
    queryKey: queryKeys.posts.list(params),
    queryFn: () => fetchPosts(params),
  });
}

export function usePosts(params?: ListParams & { championId?: string }) {
  return useQuery(postsQueryOptions(params));
}
