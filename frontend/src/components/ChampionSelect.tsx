"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ChampionIcon } from "./ChampionIcon";
import type { ChampionSummary } from "@/lib/data-dragon";
import { useChampions } from "@/hooks/useChampions";

type Props = {
  value: ChampionSummary | null;
  onChange: (champion: ChampionSummary) => void;
};

export function ChampionSelect({ value, onChange }: Props) {
  const { data: champions } = useChampions();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!champions) return [];
    const pattern = new RegExp(search.replace(/\s/g, "\\s"), "i");
    return champions.filter((champion) => pattern.test(champion.name));
  }, [champions, search]);

  useEffect(() => {
    if (!open) return;

    function updateRect() {
      const box = buttonRef.current?.getBoundingClientRect();
      if (!box) return;
      setRect({ top: box.bottom + 8, left: box.left, width: box.width });
    }

    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!buttonRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded-[10px] border border-extra/15 bg-surface/70 px-3 py-2.5 text-paper backdrop-blur-sm"
      >
        {value ? (
          <>
            <div className="grid ring-2 ring-primary/30 rounded-full overflow-hidden">
              <ChampionIcon
                championId={value.id}
                alt={value.name}
                size={22}
                className="scale-110 place-self-center"
              />
            </div>
            <span>{value.name}</span>
          </>
        ) : (
          <span className="text-muted">Elegí un campeón</span>
        )}
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            ref={panelRef}
            style={{ top: rect.top, left: rect.left, width: Math.max(rect.width, 224) }}
            className="fixed z-50 overflow-hidden rounded-[10px] border border-extra/20 bg-surface shadow-lg"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar"
              className="w-full border-b border-extra/15 bg-transparent px-3 py-2 text-paper outline-none"
            />
            <div className="max-h-56 overflow-y-auto">
              {filtered.map((champion) => (
                <button
                  key={champion.id}
                  type="button"
                  onClick={() => {
                    onChange(champion);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-paper hover:bg-primary/10"
                >
                  <div className="grid ring-2 ring-primary/30 rounded-full overflow-hidden">
                    <ChampionIcon
                      championId={champion.id}
                      alt={champion.name}
                      size={26}
                      className="scale-110 place-self-center"
                    />
                  </div>
                  <span>{champion.name}</span>
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
