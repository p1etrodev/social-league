"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchReactions,
  toggleReaction,
  type ReactionEmoji,
  type ReactionSummary,
} from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { getAnonId } from "@/lib/anon-id";

export function useReactions(postId: string) {
  const queryClient = useQueryClient();
  // localStorage isn't available during the server render of this "use
  // client" component, so the anon id is picked up after mount instead of
  // in the initial state.
  const [anonId, setAnonId] = useState<string | null>(null);
  useEffect(() => {
    setAnonId(getAnonId());
  }, []);

  const queryKey = queryKeys.posts.reactions(postId, anonId ?? "");

  const { data } = useQuery({
    queryKey,
    queryFn: () => fetchReactions(postId, anonId as string),
    enabled: Boolean(anonId),
  });

  const mutation = useMutation({
    mutationFn: (emoji: ReactionEmoji) =>
      toggleReaction(postId, { anonId: anonId as string, emoji }),
    onMutate: async (emoji) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ReactionSummary>(queryKey);

      queryClient.setQueryData<ReactionSummary>(queryKey, (current) => {
        if (!current) return current;
        const alreadyMine = current.mine.includes(emoji);
        return {
          counts: {
            ...current.counts,
            [emoji]: (current.counts[emoji] ?? 0) + (alreadyMine ? -1 : 1),
          },
          mine: alreadyMine ? current.mine.filter((e) => e !== emoji) : [...current.mine, emoji],
        };
      });

      return { previous };
    },
    onError: (_error, _emoji, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  function toggle(emoji: ReactionEmoji) {
    if (!anonId) return;
    mutation.mutate(emoji);
  }

  return { reactions: data, toggle };
}
