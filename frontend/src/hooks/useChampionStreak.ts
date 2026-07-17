import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchChampionStreak } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function championStreakQueryOptions(params?: { hours?: number; limit?: number }) {
  return queryOptions({
    queryKey: queryKeys.champions.streak(params),
    queryFn: () => fetchChampionStreak(params),
  });
}

export function useChampionStreak(params?: { hours?: number; limit?: number }) {
  return useQuery(championStreakQueryOptions(params));
}
