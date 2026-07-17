import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchPostResponses, type ListParams } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function postResponsesQueryOptions(id: string, params?: ListParams) {
  return queryOptions({
    queryKey: queryKeys.posts.responses(id, params),
    queryFn: () => fetchPostResponses(id, params),
  });
}

export function usePostResponses(id: string, params?: ListParams) {
  return useQuery(postResponsesQueryOptions(id, params));
}
