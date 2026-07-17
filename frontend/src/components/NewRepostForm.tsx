"use client";

import type { Post } from "@/lib/api";
import { useCreateRepost } from "@/hooks/useCreateRepost";
import { useLastChampion } from "@/hooks/useLastChampion";
import { ChampionSelect } from "./ChampionSelect";
import { PostCard } from "./PostCard";

export function NewRepostForm({ post, onClose }: { post: Post; onClose: () => void }) {
  const createRepost = useCreateRepost(post.id);
  const [champion, setChampion] = useLastChampion();

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
          className="rounded-full bg-gradient-to-br from-primary-bright to-primary px-5 py-2 font-black tracking-wide text-dark disabled:opacity-50"
        >
          Repostear
        </button>
      </div>
    </div>
  );
}
