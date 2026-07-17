"use client";

import { usePosts } from "@/hooks/usePosts";
import { NewPostForm } from "@/components/NewPostForm";
import { PostCard } from "@/components/PostCard";

export function HomeFeed() {
  const { data, isLoading } = usePosts();
  // The API orders oldest-first (append-friendly for the backend); the feed
  // wants newest-first, so we only flip the order for display.
  const posts = data ? [...data.posts].reverse() : [];

  return (
    <div className="flex flex-1 flex-col">
      <NewPostForm />
      {isLoading && <p className="p-4 text-muted">Cargando...</p>}
      {data && posts.length === 0 && (
        <p className="p-4 text-muted">Todavía no hay posts. ¡Sé el primero!</p>
      )}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
