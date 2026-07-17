"use client";

import { usePost } from "@/hooks/usePost";
import { usePostReposts } from "@/hooks/usePostReposts";
import { PostCard } from "@/components/PostCard";

export function RepostsView({ id }: { id: string }) {
  const { data: post } = usePost(id);
  const { data: reposts, isLoading } = usePostReposts(id);

  return (
    <div className="flex flex-1 flex-col">
      <PostCard post={post} />

      <h2 className="border-b border-extra p-4 text-sm font-bold text-muted">Reposts</h2>

      {isLoading && <p className="p-4 text-muted">Cargando...</p>}
      {reposts?.posts.length === 0 && (
        <p className="p-4 text-muted">Todavía nadie reposteó este post.</p>
      )}
      {reposts?.posts.map((repost) => (
        <PostCard key={repost.id} post={repost} />
      ))}
    </div>
  );
}
