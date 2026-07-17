"use client";

import { useMemo, useState } from "react";

import { ChampionIcon } from "@/components/ChampionIcon";
import Link from "next/link";
import { useChampions } from "@/hooks/useChampions";

export function ChampionsGrid() {
  const { data: champions, isLoading } = useChampions();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!champions) return [];
    const pattern = new RegExp(search.replace(/\s/g, "\\s"), "i");
    return champions.filter((champion) => pattern.test(champion.name));
  }, [champions, search]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar"
        className="rounded-lg border border-extra/30 bg-surface px-3 py-2 text-paper outline-none placeholder:text-muted"
      />

      {isLoading && <p className="text-muted">Cargando...</p>}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4">
        {filtered.map((champion) => (
          <Link
            key={champion.id}
            href={`/champions/${champion.id}`}
            className="flex flex-col items-center gap-2 rounded p-1 text-center hover:bg-primary/8 aspect-square justify-center"
          >
            <ChampionIcon
              championId={champion.id}
              alt={champion.name}
              size={64}
              className="size-16 rounded-full ring-2 ring-primary/30"
            />
            <p className="text-sm text-paper">{champion.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
