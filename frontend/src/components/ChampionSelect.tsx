"use client";

import { useMemo, useState } from "react";
import { useChampions } from "@/hooks/useChampions";
import type { ChampionSummary } from "@/lib/data-dragon";
import { ChampionIcon } from "./ChampionIcon";

type Props = {
  value: ChampionSummary | null;
  onChange: (champion: ChampionSummary) => void;
};

export function ChampionSelect({ value, onChange }: Props) {
  const { data: champions } = useChampions();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!champions) return [];
    const pattern = new RegExp(search.replace(/\s/g, "\\s"), "i");
    return champions.filter((champion) => pattern.test(champion.name));
  }, [champions, search]);

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded bg-extra/40 px-3 py-2 text-paper"
      >
        {value ? (
          <>
            <ChampionIcon
              championId={value.id}
              alt={value.name}
              size={24}
              className="size-6 rounded-full"
            />
            <span>{value.name}</span>
          </>
        ) : (
          <span className="text-muted">Elegí un campeón</span>
        )}
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-10 mb-2 max-h-64 w-56 overflow-y-auto rounded bg-dark shadow-lg ring-1 ring-extra">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar"
            className="w-full border-b border-extra bg-transparent px-3 py-2 text-paper outline-none"
          />
          {filtered.map((champion) => (
            <button
              key={champion.id}
              type="button"
              onClick={() => {
                onChange(champion);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-paper hover:bg-extra/40"
            >
              <ChampionIcon
                championId={champion.id}
                alt={champion.name}
                size={24}
                className="size-6 rounded-full"
              />
              <span>{champion.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
