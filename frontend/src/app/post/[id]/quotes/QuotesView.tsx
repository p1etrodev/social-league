"use client";

import { usePost } from "@/hooks/usePost";
import { usePostQuotes } from "@/hooks/usePostQuotes";
import { PostCard } from "@/components/PostCard";

export function QuotesView({ id }: { id: string }) {
  const { data: post } = usePost(id);
  const { data: quotes, isLoading } = usePostQuotes(id);

  return (
    <div className="flex flex-1 flex-col">
      <PostCard post={post} />

      <h2 className="border-b border-extra p-4 text-sm font-bold text-muted">Citas</h2>

      {isLoading && <p className="p-4 text-muted">Cargando...</p>}
      {quotes?.posts.length === 0 && (
        <p className="p-4 text-muted">Todavía nadie citó este post.</p>
      )}
      {quotes?.posts.map((quote) => (
        <PostCard key={quote.id} post={quote} />
      ))}
    </div>
  );
}
