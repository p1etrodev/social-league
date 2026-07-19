"use client";

import { usePost } from "@/hooks/usePost";
import { usePostReposts } from "@/hooks/usePostReposts";
import { flattenPosts } from "@/hooks/useInfinitePosts";
import { EmptyState } from "@/components/EmptyState";
import { InfiniteScrollSentinel } from "@/components/InfiniteScrollSentinel";
import { Loading } from "@/components/Loading";
import { PostCard } from "@/components/PostCard";

export function RepostsView({ id }: { id: string }) {
  const { data: post } = usePost(id);
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostReposts(id);
  const reposts = flattenPosts(data);

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      <PostCard post={post} />

      <h2 className="text-sm font-bold text-muted">Reposts</h2>

      {isLoading && <Loading />}
      {!isLoading && reposts.length === 0 && (
        <EmptyState title="Sin reposts" message="Todavía nadie reposteó este post." />
      )}
      {reposts.map((repost) => (
        <PostCard key={repost.id} post={repost} />
      ))}
      {isFetchingNextPage && <Loading />}
      <InfiniteScrollSentinel
        onIntersect={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      />
    </div>
  );
}
