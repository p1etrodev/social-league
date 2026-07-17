"use client";

import { usePost } from "@/hooks/usePost";
import { usePostReposts } from "@/hooks/usePostReposts";
import { EmptyState } from "@/components/EmptyState";
import { Loading } from "@/components/Loading";
import { PostCard } from "@/components/PostCard";

export function RepostsView({ id }: { id: string }) {
  const { data: post } = usePost(id);
  const { data: reposts, isLoading } = usePostReposts(id);

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      <PostCard post={post} />

      <h2 className="text-sm font-bold text-muted">Reposts</h2>

      {isLoading && <Loading />}
      {reposts?.posts.length === 0 && (
        <EmptyState title="Sin reposts" message="Todavía nadie reposteó este post." />
      )}
      {reposts?.posts.map((repost) => (
        <PostCard key={repost.id} post={repost} />
      ))}
    </div>
  );
}
