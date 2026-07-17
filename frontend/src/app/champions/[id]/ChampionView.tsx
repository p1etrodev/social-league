"use client";

import { useChampion } from "@/hooks/useChampion";

export function ChampionView({ id }: { id: string }) {
  const { data: champion } = useChampion(id);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <h1 className="font-heading text-3xl font-extrabold text-primary">{champion.name}</h1>
      <p className="text-muted">{champion.title}</p>
    </div>
  );
}
