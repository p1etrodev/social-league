import { fetchChampionResponses, type ListParams } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { infinitePostsQueryOptions, useInfinitePosts } from "./useInfinitePosts";

type Params = Omit<ListParams, "limit" | "offset">;

export function championResponsesQueryOptions(championId: string, params?: Params) {
  return infinitePostsQueryOptions(queryKeys.champions.responses(championId, params), (page) =>
    fetchChampionResponses(championId, { ...params, ...page }),
  );
}

export function useChampionResponses(championId: string, params?: Params) {
  return useInfinitePosts(queryKeys.champions.responses(championId, params), (page) =>
    fetchChampionResponses(championId, { ...params, ...page }),
  );
}
