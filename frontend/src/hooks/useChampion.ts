import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { fetchChampion } from "@/lib/data-dragon";
import { queryKeys } from "@/lib/query-keys";

export function championQueryOptions(id: string) {
  return queryOptions({
    queryKey: queryKeys.champions.detail(id),
    queryFn: () => fetchChampion(id),
    staleTime: 60 * 60 * 1000, // patch data barely changes within a session
  });
}

/** Suspends -- use inside a page prefetched with championQueryOptions + HydrationBoundary. */
export function useChampion(id: string) {
  return useSuspenseQuery(championQueryOptions(id));
}
