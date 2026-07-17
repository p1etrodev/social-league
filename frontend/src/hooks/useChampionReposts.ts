import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchChampionReposts, type ListParams } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function championRepostsQueryOptions(championId: string, params?: ListParams) {
  return queryOptions({
    queryKey: queryKeys.champions.reposts(championId, params),
    queryFn: () => fetchChampionReposts(championId, params),
  });
}

export function useChampionReposts(championId: string, params?: ListParams) {
  return useQuery(championRepostsQueryOptions(championId, params));
}
