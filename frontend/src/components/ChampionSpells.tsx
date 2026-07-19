"use client";

import Image from "next/image";
import { useLatestVersion } from "@/hooks/useLatestVersion";
import { spellIconUrl, type Spell } from "@/lib/data-dragon";
import { stripHtml } from "@/lib/format";

type Entry = { spell: Spell; type: "passive" | "spell"; key: string };

const SPELL_KEYS = ["Q", "W", "E", "R"];

export function ChampionSpells({ passive, spells }: { passive: Spell; spells: Spell[] }) {
  const { data: version } = useLatestVersion();
  const entries: Entry[] = [
    { spell: passive, type: "passive", key: "P" },
    ...spells.map((spell, index): Entry => ({ spell, type: "spell", key: SPELL_KEYS[index] })),
  ];

  if (!version) return null;

  return (
    <div className="panel flex flex-col gap-3.5 p-4">
      {entries.map((entry) => {
        const isUltimate = entry.key === "R";
        return (
          <div key={entry.spell.name} className="flex items-center gap-3">
            <div
              className={`relative size-13.5 shrink-0 overflow-hidden rounded-lg border bg-gradient-to-br from-surface-raised to-surface ${
                entry.type === "passive" ? "rounded-full" : ""
              } ${isUltimate ? "glow-blue border-secondary" : "border-extra/40"}`}
            >
              {entry.type === "spell" && (
                <span className="absolute top-0.5 left-1 z-10 font-mono text-[9.5px] text-extra">
                  {entry.key}
                </span>
              )}
              <Image
                src={spellIconUrl(version, entry.type, entry.spell.image.full)}
                alt={entry.spell.name}
                fill
                sizes="120px"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-paper">{entry.spell.name}</span>
              <span className="text-xs text-muted">{stripHtml(entry.spell.description)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
