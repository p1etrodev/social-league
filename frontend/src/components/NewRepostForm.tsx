"use client";

import { useState } from "react";
import type { ChampionSummary } from "@/lib/data-dragon";
import type { Post } from "@/lib/api";
import { useCreateRepost } from "@/hooks/useCreateRepost";
import { ChampionSelect } from "./ChampionSelect";
import { PostCard } from "./PostCard";

export function NewRepostForm({ post, onClose }: { post: Post; onClose: () => void }) {
  const createRepost = useCreateRepost(post.id);
  const [champion, setChampion] = useState<ChampionSummary | null>(null);

  function handleRepost() {
    if (!champion) return;
    createRepost.mutate({ championId: champion.id }, { onSuccess: onClose });
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-primary">Repostear</h2>
        <button type="button" onClick={onClose} className="text-muted hover:text-paper">
          Cerrar
        </button>
      </div>

      <div className="rounded border border-extra">
        <PostCard post={post} />
      </div>

      <div className="flex items-center justify-between">
        <ChampionSelect value={champion} onChange={setChampion} />
        <button
          type="button"
          onClick={handleRepost}
          disabled={!champion || createRepost.isPending}
          className="rounded bg-primary px-4 py-2 font-bold text-dark disabled:opacity-50"
        >
          Repostear
        </button>
      </div>
    </div>
  );
}
