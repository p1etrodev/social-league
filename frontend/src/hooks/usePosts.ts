import { fetchPosts, type ListParams } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { infinitePostsQueryOptions, useInfinitePosts } from "./useInfinitePosts";

type Params = Omit<ListParams, "limit" | "offset"> & { championId?: string };

export function postsQueryOptions(params?: Params) {
  return infinitePostsQueryOptions(queryKeys.posts.list(params), (page) =>
    fetchPosts({ ...params, ...page }),
  );
}

export function usePosts(params?: Params) {
  return useInfinitePosts(queryKeys.posts.list(params), (page) => fetchPosts({ ...params, ...page }));
}
