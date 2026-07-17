import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchChampionPosts, type ListParams } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function championPostsQueryOptions(championId: string, params?: ListParams) {
  return queryOptions({
    queryKey: queryKeys.champions.posts(championId, params),
    queryFn: () => fetchChampionPosts(championId, params),
  });
}

export function useChampionPosts(championId: string, params?: ListParams) {
  return useQuery(championPostsQueryOptions(championId, params));
}
