import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchChampionQuotes, type ListParams } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function championQuotesQueryOptions(championId: string, params?: ListParams) {
  return queryOptions({
    queryKey: queryKeys.champions.quotes(championId, params),
    queryFn: () => fetchChampionQuotes(championId, params),
  });
}

export function useChampionQuotes(championId: string, params?: ListParams) {
  return useQuery(championQuotesQueryOptions(championId, params));
}
