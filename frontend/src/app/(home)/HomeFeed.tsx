"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { postsQueryOptions } from "@/hooks/usePosts";
import { flattenPosts } from "@/hooks/useInfinitePosts";
import { useNewPostsBanner } from "@/hooks/useNewPostsBanner";
import { EmptyState } from "@/components/EmptyState";
import { Loading } from "@/components/Loading";
import { InfiniteScrollSentinel } from "@/components/InfiniteScrollSentinel";
import { NewPostForm } from "@/components/NewPostForm";
import { PostCard } from "@/components/PostCard";
import { StreakPanel } from "@/components/StreakPanel";

export function HomeFeed() {
  // refetchOnWindowFocus/refetchOnReconnect off on purpose: new posts are
  // meant to sit behind the "Mostrar N publicaciones nuevas" banner
  // (see useNewPostsBanner), not appear the moment the tab regains focus
  // or the socket reconnects once the query goes stale (staleTime: 60s).
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    ...postsQueryOptions({ includeResponses: true }),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { newCount, showNewPosts } = useNewPostsBanner();
  // The API now orders newest-first (required for offset-based pagination
  // to make sense with infinite scroll), so no client-side reversal needed.
  const posts = flattenPosts(data);

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
        {isFetchingNextPage && <Loading />}
        <InfiniteScrollSentinel
          onIntersect={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        />
      </div>
      <div className="hidden xl:block">
        <StreakPanel title="Racha del día" />
      </div>
    </div>
  );
}
