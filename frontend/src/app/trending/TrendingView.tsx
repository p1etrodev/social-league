"use client";

import { useTrendingPosts } from "@/hooks/useTrendingPosts";
import { EmptyState } from "@/components/EmptyState";
import { Loading } from "@/components/Loading";
import { PostCard } from "@/components/PostCard";

export function TrendingView() {
  const { data, isLoading } = useTrendingPosts();

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="border-b border-extra p-4 font-heading text-xl font-black text-primary">
        Tendencias de las últimas 24hs
      </h1>

      {isLoading && <Loading />}
      {data?.posts.length === 0 && (
        <EmptyState
          title="Todavía no hay tendencias"
          message="Todavía no hay suficiente actividad hoy."
        />
      )}
      {data?.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
