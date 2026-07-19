"use client";

import { useMemo, useState } from "react";

import Image from "next/image";
import { Modal } from "./Modal";
import { championSplashUrl } from "@/lib/data-dragon";

type Skin = { num: number; name: string };

export function ChampionSkins({ championId, skins }: { championId: string; skins: Skin[] }) {
  const allSkins = useMemo(() => [{ num: 0, name: "Clásica" }, ...skins], [skins]);
  // Data Dragon's own champion JSON lists skin numbers that sometimes have
  // no corresponding splash art on the legacy (unversioned) CDN path --
  // hide those instead of showing a broken image.
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<Skin | null>(null);

  const visibleSkins = allSkins.filter((skin) => !!loaded.has(skin.num));

  function markFailed(num: number) {
    setFailed((prev) => new Set(prev).add(num));
  }

  function markLoaded(num: number) {
    setLoaded((prev) => new Set(prev).add(num));
  }

  if (visibleSkins.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
        {visibleSkins.map((skin) => (
          <button
            key={skin.num}
            type="button"
            onClick={() => setSelected(skin)}
            className="panel overflow-hidden rounded-[9px] text-left"
          >
            <div className="relative h-19 w-full bg-extra/20">
              <Image
                src={championSplashUrl(championId, skin.num)}
                alt={skin.name}
                fill
                className={`object-cover transition-opacity ${loaded.has(skin.num) ? "opacity-100" : "opacity-0"}`}
                sizes="120px"
                onLoad={() => markLoaded(skin.num)}
                onError={() => markFailed(skin.num)}
              />
            </div>
            <p className="truncate bg-dark/50 px-2 py-1.5 text-[11px] text-muted">{skin.name}</p>
          </button>
        ))}
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-primary">{selected.name}</h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-muted hover:text-paper"
              >
                Cerrar
              </button>
            </div>
            <div className="panel relative aspect-video w-full overflow-hidden">
              <Image
                src={championSplashUrl(championId, selected.num)}
                alt={selected.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 512px"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
