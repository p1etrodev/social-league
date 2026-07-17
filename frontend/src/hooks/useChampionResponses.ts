import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchChampionResponses, type ListParams } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function championResponsesQueryOptions(championId: string, params?: ListParams) {
  return queryOptions({
    queryKey: queryKeys.champions.responses(championId, params),
    queryFn: () => fetchChampionResponses(championId, params),
  });
}

export function useChampionResponses(championId: string, params?: ListParams) {
  return useQuery(championResponsesQueryOptions(championId, params));
}
