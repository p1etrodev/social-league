"use client";

import { useState } from "react";
import Image from "next/image";
import { useLatestVersion } from "@/hooks/useLatestVersion";
import { spellIconUrl, type Spell } from "@/lib/data-dragon";
import { stripHtml } from "@/lib/format";

type Entry = { spell: Spell; type: "passive" | "spell"; key: string };

const SPELL_KEYS = ["Q", "W", "E", "R"];

export function ChampionSpells({ passive, spells }: { passive: Spell; spells: Spell[] }) {
  const { data: version } = useLatestVersion();
  const entries: Entry[] = [
    { spell: passive, type: "passive", key: "Pasiva" },
    ...spells.map((spell, index): Entry => ({ spell, type: "spell", key: SPELL_KEYS[index] })),
  ];
  const [current, setCurrent] = useState<Entry>(entries[0]);

  if (!version) return null;

  return (
    <div className="panel flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        {entries.map((entry) => {
          const isUltimate = entry.key === "R";
          return (
            <button
              key={entry.spell.name}
              type="button"
              onMouseEnter={() => setCurrent(entry)}
              onFocus={() => setCurrent(entry)}
              className={`relative size-13 shrink-0 overflow-hidden rounded-lg border ${
                isUltimate ? "glow-blue border-secondary" : "border-extra/40"
              } ${entry === current && !isUltimate ? "ring-2 ring-primary" : ""} ${
                entry.type === "passive" ? "rounded-full" : ""
              }`}
            >
              {entry.type === "spell" && (
                <span className="absolute top-0.5 left-1 z-10 font-mono text-[10px] text-primary-bright">
                  {entry.key}
                </span>
              )}
              <Image
                src={spellIconUrl(version, entry.type, entry.spell.image.full)}
                alt={entry.spell.name}
                fill
              />
            </button>
          );
        })}
      </div>
      <div>
        <p className="font-bold text-primary">
          {current.spell.name} ({current.key})
        </p>
        <p className="text-sm text-muted">{stripHtml(current.spell.description)}</p>
      </div>
    </div>
  );
}
