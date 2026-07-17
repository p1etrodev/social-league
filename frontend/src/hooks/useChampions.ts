import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchChampions } from "@/lib/data-dragon";
import { queryKeys } from "@/lib/query-keys";

export function championsQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.champions.list(),
    queryFn: fetchChampions,
    staleTime: 60 * 60 * 1000,
  });
}

export function useChampions() {
  return useQuery(championsQueryOptions());
}
