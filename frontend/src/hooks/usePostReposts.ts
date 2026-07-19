import { fetchPostReposts, type ListParams } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { infinitePostsQueryOptions, useInfinitePosts } from "./useInfinitePosts";

type Params = Omit<ListParams, "limit" | "offset">;

export function postRepostsQueryOptions(id: string, params?: Params) {
  return infinitePostsQueryOptions(queryKeys.posts.reposts(id, params), (page) =>
    fetchPostReposts(id, { ...params, ...page }),
  );
}

export function usePostReposts(id: string, params?: Params) {
  return useInfinitePosts(queryKeys.posts.reposts(id, params), (page) =>
    fetchPostReposts(id, { ...params, ...page }),
  );
}
