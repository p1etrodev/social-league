"use client";

import { useState, type FormEvent } from "react";
import type { NewPostInput } from "@/lib/api";
import { useLastChampion } from "@/hooks/useLastChampion";
import { ChampionSelect } from "./ChampionSelect";

type Props = {
  placeholder: string;
  buttonLabel: string;
  isPending: boolean;
  onSubmit: (input: NewPostInput, reset: () => void) => void;
  className?: string;
};

export function PostComposer({ placeholder, buttonLabel, isPending, onSubmit, className }: Props) {
  const [champion, setChampion] = useLastChampion();
  const [content, setContent] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!champion || !content.trim()) return;
    onSubmit({ championId: champion.id, content }, () => setContent(""));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-3 border-b border-extra p-4 ${className ?? ""}`}
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        maxLength={280}
        rows={3}
        className="resize-none rounded bg-extra/20 p-3 text-paper outline-none placeholder:text-muted"
      />
      <div className="flex items-center justify-between">
        <ChampionSelect value={champion} onChange={setChampion} />
        <button
          type="submit"
          disabled={!champion || !content.trim() || isPending}
          className="rounded bg-primary px-4 py-2 font-bold text-dark disabled:opacity-50"
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}
