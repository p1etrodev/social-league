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
  /** Skips the panel card chrome for composers already nested inside
   * another card (e.g. a modal), so it doesn't double up. */
  bare?: boolean;
};

export function PostComposer({
  placeholder,
  buttonLabel,
  isPending,
  onSubmit,
  className,
  bare,
}: Props) {
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
      className={`relative flex flex-col gap-3 ${bare ? "" : "panel p-4"} ${className ?? ""}`}
    >
      {!bare && (
        <div className="absolute inset-x-4 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        maxLength={280}
        rows={3}
        className="resize-none bg-transparent pt-2 text-paper outline-none placeholder:text-muted"
      />
      <div className="flex items-center justify-between">
        <ChampionSelect value={champion} onChange={setChampion} />
        <button
          type="submit"
          disabled={!champion || !content.trim() || isPending}
          className="animate-hex-pulse rounded-full bg-gradient-to-br from-secondary-bright to-secondary px-5 py-2 font-black tracking-wide text-secondary-ink disabled:animate-none disabled:opacity-50"
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}
