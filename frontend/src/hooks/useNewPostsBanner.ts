"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchPost, type PostList } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { postsWsUrl } from "@/lib/ws";

type NewPostEvent = { event: string; postId: string };

/**
 * Drives the "Mostrar N publicaciones nuevas" banner on the home feed.
 * `/ws/posts` broadcasts every new post/response/quote/repost, so each
 * event is resolved to a full post to check it's actually a root post
 * (the only kind the home feed shows) before counting it.
 *
 * When *we* create a post, the broadcast comes back over our own socket
 * too. The 500ms wait before checking the cache gives our own mutation's
 * optimistic update (and its onSettled refetch, which swaps the
 * optimistic id for the real one) time to land, so we don't show a "new
 * post" banner for a post we just published ourselves.
 */
export function useNewPostsBanner() {
  const queryClient = useQueryClient();
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    function connect() {
      socket = new WebSocket(postsWsUrl());

      socket.onmessage = async (rawEvent) => {
        const message = JSON.parse(rawEvent.data) as NewPostEvent;
        if (message.event !== "new_post") return;

        try {
          const post = await fetchPost(message.postId);
          if (cancelled || post.responseOf !== null) return;

          setTimeout(() => {
            if (cancelled) return;
            const feed = queryClient.getQueryData<PostList>(queryKeys.posts.list());
            if (feed?.posts.some((p) => p.id === message.postId)) return;
            setNewCount((count) => count + 1);
          }, 500);
        } catch {
          // Post may already be gone or the request raced a teardown; skip it.
        }
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
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.list() });
    setNewCount(0);
  }

  return { newCount, showNewPosts };
}
