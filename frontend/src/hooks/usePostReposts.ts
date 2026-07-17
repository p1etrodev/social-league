import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchPostReposts, type ListParams } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function postRepostsQueryOptions(id: string, params?: ListParams) {
  return queryOptions({
    queryKey: queryKeys.posts.reposts(id, params),
    queryFn: () => fetchPostReposts(id, params),
  });
}

export function usePostReposts(id: string, params?: ListParams) {
  return useQuery(postRepostsQueryOptions(id, params));
}
