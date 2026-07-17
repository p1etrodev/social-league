"use client";

import { useState } from "react";
import Image from "next/image";
import { useChampion } from "@/hooks/useChampion";
import { useChampionPosts } from "@/hooks/useChampionPosts";
import { useChampionResponses } from "@/hooks/useChampionResponses";
import { championLoadingUrl, championSplashUrl } from "@/lib/data-dragon";
import { toIdentifier } from "@/lib/format";
import { tagLabel } from "@/lib/tags";
import { PostCard } from "@/components/PostCard";
import { StatRating } from "@/components/StatRating";
import { ChampionSkins } from "@/components/ChampionSkins";
import { ChampionSpells } from "@/components/ChampionSpells";

const TABS = [
  { key: "posts", label: "Publicaciones" },
  { key: "responses", label: "Respuestas" },
  { key: "skins", label: "Skins" },
  { key: "skills", label: "Habilidades" },
] as const;

type Tab = (typeof TABS)[number]["key"];

function PostsTab({ championId }: { championId: string }) {
  const { data, isLoading } = useChampionPosts(championId);
  if (isLoading) return <p className="p-4 text-muted">Cargando...</p>;
  if (data?.posts.length === 0) {
    return <p className="p-4 text-muted">Todavía no tiene publicaciones.</p>;
  }
  return data?.posts.map((post) => <PostCard key={post.id} post={post} />);
}

function ResponsesTab({ championId }: { championId: string }) {
  const { data, isLoading } = useChampionResponses(championId);
  if (isLoading) return <p className="p-4 text-muted">Cargando...</p>;
  if (data?.posts.length === 0) {
    return <p className="p-4 text-muted">Todavía no respondió a ninguna publicación.</p>;
  }
  return data?.posts.map((response) => <PostCard key={response.id} post={response} />);
}

export function ChampionView({ id }: { id: string }) {
  const { data: champion } = useChampion(id);
  const [tab, setTab] = useState<Tab>("posts");

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative flex flex-col gap-4 overflow-hidden border-b border-extra p-4 sm:flex-row">
        <div className="absolute inset-0 -z-10">
          <Image
            src={championSplashUrl(champion.id)}
            alt=""
            fill
            priority
            className="object-cover object-top opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/40 via-dark/80 to-dark" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative aspect-[308/560] w-full max-w-56 overflow-hidden rounded">
            <Image
              src={championLoadingUrl(champion.id)}
              alt={champion.name}
              fill
              className="object-cover"
              sizes="224px"
            />
          </div>
          <div className="flex flex-col gap-1">
            {Object.entries(champion.info).map(([stat, value]) => (
              <StatRating key={stat} label={statLabel(stat)} value={value} />
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div>
            <h1 className="font-heading text-2xl font-black text-primary">{champion.name}</h1>
            <p className="text-muted">{toIdentifier(champion.title)}</p>
          </div>
          <div className="flex gap-2">
            {champion.tags.map((tag) => (
              <span key={tag} className="rounded bg-extra/40 px-2 py-1 text-xs text-paper">
                {tagLabel(tag)}
              </span>
            ))}
          </div>
          <p className="text-sm text-paper">{champion.lore}</p>
        </div>
      </div>

      <div className="flex border-b border-extra">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex-1 p-3 text-sm font-bold ${
              tab === t.key ? "border-b-2 border-primary text-primary" : "text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "posts" && <PostsTab championId={champion.id} />}
      {tab === "responses" && <ResponsesTab championId={champion.id} />}
      {tab === "skins" && <ChampionSkins championId={champion.id} skins={champion.skins} />}
      {tab === "skills" && <ChampionSpells passive={champion.passive} spells={champion.spells} />}
    </div>
  );
}

function statLabel(stat: string): string {
  const labels: Record<string, string> = {
    attack: "Ataque",
    defense: "Defensa",
    magic: "Magia",
    difficulty: "Dificultad",
  };
  return labels[stat] ?? stat;
}
