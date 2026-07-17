import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { fetchPost } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function postQueryOptions(id: string) {
  return queryOptions({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => fetchPost(id),
  });
}

/** Suspends -- use inside a page prefetched with postQueryOptions + HydrationBoundary. */
export function usePost(id: string) {
  return useSuspenseQuery(postQueryOptions(id));
}
