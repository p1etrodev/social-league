import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchPostQuotes, type ListParams } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function postQuotesQueryOptions(id: string, params?: ListParams) {
  return queryOptions({
    queryKey: queryKeys.posts.quotes(id, params),
    queryFn: () => fetchPostQuotes(id, params),
  });
}

export function usePostQuotes(id: string, params?: ListParams) {
  return useQuery(postQuotesQueryOptions(id, params));
}
