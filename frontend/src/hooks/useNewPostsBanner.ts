"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { PostList } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { postsWsUrl } from "@/lib/ws";

type NewPostEvent = { event: string; postId: string };

/**
 * Drives the "Mostrar N publicaciones nuevas" banner on the home feed.
 * `/ws/posts` broadcasts every new post/response/quote/repost -- the home
 * feed now shows all of those (see HomeFeed's `includeResponses: true`),
 * so every broadcast counts.
 *
 * When *we* create a post, the broadcast comes back over our own socket
 * too. The 500ms wait before checking the cache gives our own mutation's
 * optimistic update (and its onSettled refetch, which swaps the
 * optimistic id for the real one) time to land, so we don't show a "new
 * post" banner for a post we just published ourselves.
 */
const HOME_FEED_PARAMS = { includeResponses: true };

export function useNewPostsBanner() {
  const queryClient = useQueryClient();
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    function connect() {
      socket = new WebSocket(postsWsUrl());

      socket.onmessage = (rawEvent) => {
        const message = JSON.parse(rawEvent.data) as NewPostEvent;
        if (message.event !== "new_post") return;

        setTimeout(() => {
          if (cancelled) return;
          const feed = queryClient.getQueryData<PostList>(queryKeys.posts.list(HOME_FEED_PARAMS));
          if (feed?.posts.some((p) => p.id === message.postId)) return;
          setNewCount((count) => count + 1);
        }, 500);
      };

      socket.onclose = () => {
        if (!cancelled) reconnectTimeout = setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      socket?.close();
    };
  }, [queryClient]);

  function showNewPosts() {
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.list(HOME_FEED_PARAMS) });
    setNewCount(0);
  }

  return { newCount, showNewPosts };
}
