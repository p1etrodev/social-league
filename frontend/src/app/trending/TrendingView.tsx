"use client";

import { ChampionIcon } from "@/components/ChampionIcon";
import { EmptyState } from "@/components/EmptyState";
import Link from "next/link";
import { Loading } from "@/components/Loading";
import type { Post } from "@/lib/api";
import { StreakPanel } from "@/components/StreakPanel";
import { championQueryOptions } from "@/hooks/useChampion";
import { useQuery } from "@tanstack/react-query";
import { useTrendingPosts } from "@/hooks/useTrendingPosts";

const MEDAL_STYLES = [
  {
    num: "text-primary-bright drop-shadow-[0_0_10px_rgba(216,180,92,0.5)]",
    bar: "from-extra to-primary-bright",
  },
  { num: "text-silver", bar: "from-extra to-silver" },
  { num: "text-bronze", bar: "from-extra to-bronze" },
];

function TrendingRow({ post, rank, maxScore }: { post: Post; rank: number; maxScore: number }) {
  const { data: champion } = useQuery(championQueryOptions(post.championId));
  const score = post.quotesCount + post.repostsCount;
  const width = maxScore > 0 ? Math.max((score / maxScore) * 100, 6) : 6;
  const medal = MEDAL_STYLES[rank - 1];

  return (
    <Link href={`/post/${post.id}`} className="panel panel-hover flex items-center gap-4 p-4">
      <span
        className={`w-8 shrink-0 text-center font-heading text-2xl font-black ${medal ? medal.num : "text-muted"}`}
      >
        {String(rank).padStart(2, "0")}
      </span>
      <div className="grid ring-2 ring-primary/30 rounded-full overflow-hidden">
        <ChampionIcon
          championId={post.championId}
          alt={post.championId}
          size={64}
          className="scale-110 place-self-center"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-paper">{champion?.name ?? post.championId}</p>
        <p className="truncate text-sm text-muted">{post.content}</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-extra/15">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${medal ? medal.bar : "from-extra to-muted"}`}
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
    </Link>
  );
}

export function TrendingView() {
  const { data, isLoading } = useTrendingPosts();
  const maxScore = data?.posts[0] ? data.posts[0].quotesCount + data.posts[0].repostsCount : 0;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-extra p-4">
        <h1 className="font-heading text-xl font-black text-primary">Tendencias</h1>
        <span className="font-mono text-xs font-bold tracking-wide text-muted uppercase">
          Últimas 24hs
        </span>
      </div>

      <div className="flex flex-1 gap-4 p-4">
        <div className="flex flex-1 flex-col gap-3">
          {isLoading && <Loading />}
          {data?.posts.length === 0 && (
            <EmptyState
              title="Todavía no hay tendencias"
              message="Todavía no hay suficiente actividad hoy."
            />
          )}
          {data?.posts.map((post, index) => (
            <TrendingRow key={post.id} post={post} rank={index + 1} maxScore={maxScore} />
          ))}
        </div>
        <div className="hidden xl:block">
          <StreakPanel title="Campeones en racha" />
        </div>
      </div>
    </div>
  );
}
