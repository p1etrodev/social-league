import { fetchChampionPosts, type ListParams } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { infinitePostsQueryOptions, useInfinitePosts } from "./useInfinitePosts";

type Params = Omit<ListParams, "limit" | "offset">;

export function championPostsQueryOptions(championId: string, params?: Params) {
  return infinitePostsQueryOptions(queryKeys.champions.posts(championId, params), (page) =>
    fetchChampionPosts(championId, { ...params, ...page }),
  );
}

export function useChampionPosts(championId: string, params?: Params) {
  return useInfinitePosts(queryKeys.champions.posts(championId, params), (page) =>
    fetchChampionPosts(championId, { ...params, ...page }),
  );
}
