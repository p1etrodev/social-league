import { fetchPostResponses, type ListParams } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { infinitePostsQueryOptions, useInfinitePosts } from "./useInfinitePosts";

type Params = Omit<ListParams, "limit" | "offset">;

export function postResponsesQueryOptions(id: string, params?: Params) {
  return infinitePostsQueryOptions(queryKeys.posts.responses(id, params), (page) =>
    fetchPostResponses(id, { ...params, ...page }),
  );
}

export function usePostResponses(id: string, params?: Params) {
  return useInfinitePosts(queryKeys.posts.responses(id, params), (page) =>
    fetchPostResponses(id, { ...params, ...page }),
  );
}
