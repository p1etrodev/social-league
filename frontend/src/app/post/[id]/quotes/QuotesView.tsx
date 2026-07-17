"use client";

import { usePost } from "@/hooks/usePost";
import { usePostQuotes } from "@/hooks/usePostQuotes";
import { EmptyState } from "@/components/EmptyState";
import { Loading } from "@/components/Loading";
import { PostCard } from "@/components/PostCard";

export function QuotesView({ id }: { id: string }) {
  const { data: post } = usePost(id);
  const { data: quotes, isLoading } = usePostQuotes(id);

  return (
    <div className="flex flex-1 flex-col">
      <PostCard post={post} />

      <h2 className="border-b border-extra p-4 text-sm font-bold text-muted">Citas</h2>

      {isLoading && <Loading />}
      {quotes?.posts.length === 0 && (
        <EmptyState title="Sin citas" message="Todavía nadie citó este post." />
      )}
      {quotes?.posts.map((quote) => (
        <PostCard key={quote.id} post={quote} />
      ))}
    </div>
  );
}
