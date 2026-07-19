"use client";

import { championLoadingUrl, championSplashUrl } from "@/lib/data-dragon";

import { ChampionSkins } from "@/components/ChampionSkins";
import { ChampionSpells } from "@/components/ChampionSpells";
import { EmptyState } from "@/components/EmptyState";
import Image from "next/image";
import { InfiniteScrollSentinel } from "@/components/InfiniteScrollSentinel";
import { Loading } from "@/components/Loading";
import { PostCard } from "@/components/PostCard";
import { StatRating } from "@/components/StatRating";
import { flattenPosts } from "@/hooks/useInfinitePosts";
import { tagLabel } from "@/lib/tags";
import { toIdentifier } from "@/lib/format";
import { useChampion } from "@/hooks/useChampion";
import { useChampionPosts } from "@/hooks/useChampionPosts";
import { useChampionResponses } from "@/hooks/useChampionResponses";
import { useState } from "react";

const TABS = [
  { key: "posts", label: "Publicaciones" },
  { key: "responses", label: "Respuestas" },
  { key: "skins", label: "Skins" },
  { key: "skills", label: "Habilidades" },
] as const;

type Tab = (typeof TABS)[number]["key"];

function PostsTab({ championId }: { championId: string }) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChampionPosts(championId);
  const posts = flattenPosts(data);
  if (isLoading) return <Loading />;
  if (posts.length === 0) {
    return <EmptyState title="Sin publicaciones" message="Todavía no tiene publicaciones." />;
  }
  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loading />}
      <InfiniteScrollSentinel
        onIntersect={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      />
    </>
  );
}

function ResponsesTab({ championId }: { championId: string }) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChampionResponses(championId);
  const responses = flattenPosts(data);
  if (isLoading) return <Loading />;
  if (responses.length === 0) {
    return (
      <EmptyState title="Sin respuestas" message="Todavía no respondió a ninguna publicación." />
    );
  }
  return (
    <>
      {responses.map((response) => (
        <PostCard key={response.id} post={response} />
      ))}
      {isFetchingNextPage && <Loading />}
      <InfiniteScrollSentinel
        onIntersect={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      />
    </>
  );
}

export function ChampionView({ id }: { id: string }) {
  const { data: champion } = useChampion(id);
  const [tab, setTab] = useState<Tab>("posts");

  const statValues = Object.values(champion.info);
  const power = statValues.reduce((sum, v) => sum + v, 0) / statValues.length;
  const powerAngle = (power / 10) * 360;

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative overflow-hidden border-b border-extra pt-4 pb-10 sm:pb-4">
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
        <span className="pointer-events-none absolute top-0 right-2 font-heading text-8xl font-black text-paper/10 select-none">
          {champion.name.slice(0, 2).toUpperCase()}
        </span>
        <div className="flex flex-col gap-4 px-4 sm:flex-row">
          <div className="relative aspect-[308/560] w-full max-w-56 overflow-hidden rounded">
            <Image
              src={championLoadingUrl(champion.id)}
              alt={champion.name}
              fill
              className="object-cover"
              sizes="224px"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div>
              <h1 className="font-heading text-2xl font-black text-primary">{champion.name}</h1>
              <p className="text-muted">{toIdentifier(champion.title)}</p>
            </div>
            <div className="flex gap-2">
              {champion.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-secondary-dim bg-secondary/10 px-2 py-1 text-xs font-bold text-secondary"
                >
                  {tagLabel(tag)}
                </span>
              ))}
            </div>
            <p className="text-sm text-paper">{champion.lore}</p>
          </div>
        </div>

        <div className="panel relative z-10 mx-4 -mb-14 mt-4 flex items-center gap-5 p-4 sm:-mb-6">
          <div
            className="flex size-19 shrink-0 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(var(--color-primary-bright) 0deg ${powerAngle}deg, rgba(148,168,199,0.14) ${powerAngle}deg 360deg)`,
            }}
          >
            <div className="flex size-15 flex-col items-center justify-center rounded-full bg-surface">
              <b className="font-mono text-lg text-primary-bright">{power.toFixed(1)}</b>
              <small className="text-[8px] tracking-wide text-muted uppercase">Poder</small>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            {Object.entries(champion.info).map(([stat, value]) => (
              <StatRating key={stat} label={statLabel(stat)} value={value} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex border-b border-extra sm:mt-0">
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

      <div className="flex flex-1 flex-col gap-3 p-4">
        {tab === "posts" && <PostsTab championId={champion.id} />}
        {tab === "responses" && <ResponsesTab championId={champion.id} />}
        {tab === "skins" && <ChampionSkins championId={champion.id} skins={champion.skins} />}
        {tab === "skills" && <ChampionSpells passive={champion.passive} spells={champion.spells} />}
      </div>
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
