"use client";

import { useEffect, useRef, useState } from "react";
import type { ChampionSummary } from "@/lib/data-dragon";
import { useChampions } from "./useChampions";

const STORAGE_KEY = "social-league:last-champion";

/**
 * Remembers the last champion picked in any composer (post/response/quote/
 * repost) across visits, so posting doesn't require reselecting every time.
 * Purely a convenience default -- there's no auth, so it's still just a
 * local hint and every composer's ChampionSelect stays fully editable.
 */
export function useLastChampion() {
  const { data: champions } = useChampions();
  const [champion, setChampionState] = useState<ChampionSummary | null>(null);
  const restored = useRef(false);

  useEffect(() => {
    if (!champions || restored.current) return;
    restored.current = true;
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (!savedId) return;
    const match = champions.find((c) => c.id === savedId);
    if (match) setChampionState(match);
  }, [champions]);

  function setChampion(next: ChampionSummary) {
    setChampionState(next);
    localStorage.setItem(STORAGE_KEY, next.id);
  }

  return [champion, setChampion] as const;
}
