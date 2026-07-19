"use client";

import { usePost } from "@/hooks/usePost";
import { usePostResponses } from "@/hooks/usePostResponses";
import { flattenPosts } from "@/hooks/useInfinitePosts";
import { InfiniteScrollSentinel } from "@/components/InfiniteScrollSentinel";
import { Loading } from "@/components/Loading";
import { PostCard } from "@/components/PostCard";
import { NewResponseForm } from "@/components/NewResponseForm";

export function PostView({ id }: { id: string }) {
  const { data: post } = usePost(id);
  const {
    data,
    isLoading: responsesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostResponses(id);
  const responses = flattenPosts(data);

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      <PostCard post={post} />

      <NewResponseForm postId={id} />

      {responsesLoading && <Loading label="Cargando respuestas…" />}
      {responses.map((response) => (
        <PostCard key={response.id} post={response} hideParentContext />
      ))}
      {isFetchingNextPage && <Loading />}
      <InfiniteScrollSentinel
        onIntersect={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      />
    </div>
  );
}
