"use client";

import { useTrendingPosts } from "@/hooks/useTrendingPosts";
import { PostCard } from "@/components/PostCard";

export function TrendingView() {
  const { data, isLoading } = useTrendingPosts();

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="border-b border-extra p-4 font-heading text-xl font-black text-primary">
        Tendencias de las últimas 24hs
      </h1>

      {isLoading && <p className="p-4 text-muted">Cargando...</p>}
      {data?.posts.length === 0 && (
        <p className="p-4 text-muted">Todavía no hay suficiente actividad hoy.</p>
      )}
      {data?.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
