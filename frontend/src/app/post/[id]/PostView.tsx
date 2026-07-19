"use client";

import { usePost } from "@/hooks/usePost";
import { usePostResponses } from "@/hooks/usePostResponses";
import { Loading } from "@/components/Loading";
import { PostCard } from "@/components/PostCard";
import { NewResponseForm } from "@/components/NewResponseForm";

export function PostView({ id }: { id: string }) {
  const { data: post } = usePost(id);
  const { data: responses, isLoading: responsesLoading } = usePostResponses(id);

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      <PostCard post={post} />

      <NewResponseForm postId={id} />

      {responsesLoading && <Loading label="Cargando respuestas…" />}
      {responses?.posts.map((response) => (
        <PostCard key={response.id} post={response} hideParentContext />
      ))}
    </div>
  );
}
