import { fetchPostQuotes, type ListParams } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { infinitePostsQueryOptions, useInfinitePosts } from "./useInfinitePosts";

type Params = Omit<ListParams, "limit" | "offset">;

export function postQuotesQueryOptions(id: string, params?: Params) {
  return infinitePostsQueryOptions(queryKeys.posts.quotes(id, params), (page) =>
    fetchPostQuotes(id, { ...params, ...page }),
  );
}

export function usePostQuotes(id: string, params?: Params) {
  return useInfinitePosts(queryKeys.posts.quotes(id, params), (page) =>
    fetchPostQuotes(id, { ...params, ...page }),
  );
}
