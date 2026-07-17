import type { ListParams } from "./api";

export const queryKeys = {
  champions: {
    all: ["champions"] as const,
    list: () => [...queryKeys.champions.all, "list"] as const,
    detail: (id: string) => [...queryKeys.champions.all, "detail", id] as const,
    posts: (id: string, params?: ListParams) =>
      [...queryKeys.champions.all, id, "posts", params ?? {}] as const,
    responses: (id: string, params?: ListParams) =>
      [...queryKeys.champions.all, id, "responses", params ?? {}] as const,
    quotes: (id: string, params?: ListParams) =>
      [...queryKeys.champions.all, id, "quotes", params ?? {}] as const,
    reposts: (id: string, params?: ListParams) =>
      [...queryKeys.champions.all, id, "reposts", params ?? {}] as const,
  },
  posts: {
    all: ["posts"] as const,
    list: (params?: ListParams & { championId?: string }) =>
      [...queryKeys.posts.all, "list", params ?? {}] as const,
    detail: (id: string) => [...queryKeys.posts.all, "detail", id] as const,
    responses: (id: string, params?: ListParams) =>
      [...queryKeys.posts.all, id, "responses", params ?? {}] as const,
    quotes: (id: string, params?: ListParams) =>
      [...queryKeys.posts.all, id, "quotes", params ?? {}] as const,
    reposts: (id: string, params?: ListParams) =>
      [...queryKeys.posts.all, id, "reposts", params ?? {}] as const,
  },
};
