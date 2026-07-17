"use client";

import { usePosts } from "@/hooks/usePosts";
import { useNewPostsBanner } from "@/hooks/useNewPostsBanner";
import { EmptyState } from "@/components/EmptyState";
import { Loading } from "@/components/Loading";
import { NewPostForm } from "@/components/NewPostForm";
import { PostCard } from "@/components/PostCard";
import { StreakPanel } from "@/components/StreakPanel";

export function HomeFeed() {
  const { data, isLoading } = usePosts();
  const { newCount, showNewPosts } = useNewPostsBanner();
  // The API orders oldest-first (append-friendly for the backend); the feed
  // wants newest-first, so we only flip the order for display.
  const posts = data ? [...data.posts].reverse() : [];

  return (
    <div className="flex flex-1 gap-4 p-4">
      <div className="flex flex-1 flex-col gap-3">
        <NewPostForm />
        {newCount > 0 && (
          <button
            type="button"
            onClick={showNewPosts}
            className="flex items-center justify-center gap-2 rounded-lg border border-secondary/30 bg-secondary-dim p-3 text-center font-bold text-secondary-bright hover:bg-secondary-dim/70"
          >
            <span className="glow-blue animate-dot-pulse size-1.5 rounded-full bg-secondary" />
            Mostrar {newCount} publicaciones nuevas
          </button>
        )}
        {isLoading && <Loading />}
        {data && posts.length === 0 && (
          <EmptyState title="Todavía no hay posts" message="¡Sé el primero!" />
        )}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <div className="hidden xl:block">
        <StreakPanel title="Racha del día" />
      </div>
    </div>
  );
}
