"use client";

import { useState, type FormEvent } from "react";
import { useCreatePost } from "@/hooks/useCreatePost";
import type { ChampionSummary } from "@/lib/data-dragon";
import { ChampionSelect } from "./ChampionSelect";

export function NewPostForm() {
  const [champion, setChampion] = useState<ChampionSummary | null>(null);
  const [content, setContent] = useState("");
  const createPost = useCreatePost();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!champion || !content.trim()) return;
    createPost.mutate({ championId: champion.id, content }, { onSuccess: () => setContent("") });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border-b border-extra p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="¿Qué estás pensando?"
        maxLength={280}
        rows={3}
        className="resize-none rounded bg-extra/20 p-3 text-paper outline-none placeholder:text-muted"
      />
      <div className="flex items-center justify-between">
        <ChampionSelect value={champion} onChange={setChampion} />
        <button
          type="submit"
          disabled={!champion || !content.trim() || createPost.isPending}
          className="rounded bg-primary px-4 py-2 font-bold text-dark disabled:opacity-50"
        >
          Publicar
        </button>
      </div>
    </form>
  );
}
