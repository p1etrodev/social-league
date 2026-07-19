"use client";

import { ChampionIcon } from "./ChampionIcon";
import type { ChampionStreak } from "@/lib/api";
import Link from "next/link";
import { championQueryOptions } from "@/hooks/useChampion";
import { useChampionStreak } from "@/hooks/useChampionStreak";
import { useQuery } from "@tanstack/react-query";

function StreakRow({ champion, rank }: { champion: ChampionStreak; rank: number }) {
  const { data } = useQuery(championQueryOptions(champion.championId));

  return (
    <Link
      href={`/champions/${champion.championId}`}
      className="flex items-center gap-2 py-1.5 text-sm text-muted hover:text-paper"
    >
      <span className="w-4 shrink-0 font-mono font-bold text-extra">
        {String(rank).padStart(2, "0")}
      </span>
      <div className="grid ring-2 ring-primary/30 rounded-full overflow-hidden">
        <ChampionIcon
          championId={champion.championId}
          alt={champion.championId}
          size={22}
          className="scale-110 place-self-center"
        />
      </div>
      <span className="truncate font-bold text-paper">{data?.name ?? champion.championId}</span>
    </Link>
  );
}

export function StreakPanel({ title }: { title: string }) {
  const { data, isLoading } = useChampionStreak();

  if (isLoading || !data || data.champions.length === 0) return null;

  return (
    <div className="panel flex w-52 shrink-0 flex-col gap-1 p-4">
      <p className="mb-1 text-xs font-bold tracking-wide text-primary uppercase">{title}</p>
      {data.champions.map((champion, index) => (
        <StreakRow key={champion.championId} champion={champion} rank={index + 1} />
      ))}
    </div>
  );
}
