"use client";

import { usePost } from "@/hooks/usePost";
import { usePostQuotes } from "@/hooks/usePostQuotes";
import { flattenPosts } from "@/hooks/useInfinitePosts";
import { EmptyState } from "@/components/EmptyState";
import { InfiniteScrollSentinel } from "@/components/InfiniteScrollSentinel";
import { Loading } from "@/components/Loading";
import { PostCard } from "@/components/PostCard";

export function QuotesView({ id }: { id: string }) {
  const { data: post } = usePost(id);
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostQuotes(id);
  const quotes = flattenPosts(data);

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      <PostCard post={post} />

      <h2 className="text-sm font-bold text-muted">Citas</h2>

      {isLoading && <Loading />}
      {!isLoading && quotes.length === 0 && (
        <EmptyState title="Sin citas" message="Todavía nadie citó este post." />
      )}
      {quotes.map((quote) => (
        <PostCard key={quote.id} post={quote} />
      ))}
      {isFetchingNextPage && <Loading />}
      <InfiniteScrollSentinel
        onIntersect={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      />
    </div>
  );
}
