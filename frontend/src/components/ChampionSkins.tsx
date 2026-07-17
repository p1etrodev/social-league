"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { championSplashUrl } from "@/lib/data-dragon";

export function ChampionSkins({ championId, skins }: { championId: string; skins: number[] }) {
  const allSkins = useMemo(() => [0, ...skins], [skins]);
  const [current, setCurrent] = useState(0);
  // Data Dragon's own champion JSON lists skin numbers that sometimes have
  // no corresponding splash art on the legacy (unversioned) CDN path --
  // hide those instead of showing a broken image.
  const [failed, setFailed] = useState<Set<number>>(new Set());

  const visibleSkins = allSkins.filter((skin) => !failed.has(skin));

  function markFailed(skin: number) {
    setFailed((prev) => new Set(prev).add(skin));
    if (skin === current) {
      const next = visibleSkins.find((s) => s !== skin);
      if (next !== undefined) setCurrent(next);
    }
  }

  if (visibleSkins.length === 0) return null;

  return (
    <div className="panel flex flex-col gap-3 p-4">
      <div className="relative aspect-video w-full overflow-hidden rounded bg-extra/20">
        <Image
          src={championSplashUrl(championId, current)}
          alt={`${championId} skin ${current}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 600px"
          onError={() => markFailed(current)}
        />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {visibleSkins.map((skin) => (
          <button
            key={skin}
            type="button"
            onClick={() => setCurrent(skin)}
            className={`relative size-16 shrink-0 overflow-hidden rounded ${
              skin === current ? "ring-2 ring-primary" : "opacity-60"
            }`}
          >
            <Image
              src={championSplashUrl(championId, skin)}
              alt={`${championId} skin ${skin} thumbnail`}
              fill
              className="object-cover"
              sizes="64px"
              onError={() => markFailed(skin)}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
