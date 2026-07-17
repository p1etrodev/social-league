"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { postQueryOptions, usePost } from "@/hooks/usePost";
import { usePostResponses } from "@/hooks/usePostResponses";
import { Loading } from "@/components/Loading";
import { PostCard } from "@/components/PostCard";
import { NewResponseForm } from "@/components/NewResponseForm";

function RespondsToBanner({ parentId }: { parentId: string }) {
  const { data: parent } = useQuery(postQueryOptions(parentId));
  if (!parent) return null;

  return (
    <Link href={`/post/${parent.id}`} className="block text-sm text-muted">
      Respuesta a: <span className="text-paper">{parent.content}</span>
    </Link>
  );
}

export function PostView({ id }: { id: string }) {
  const { data: post } = usePost(id);
  const { data: quoted } = useQuery({
    ...postQueryOptions(post.quoteOf ?? ""),
    enabled: Boolean(post.quoteOf),
  });
  const { data: responses, isLoading: responsesLoading } = usePostResponses(id);

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      {post.responseOf && <RespondsToBanner parentId={post.responseOf} />}

      <PostCard post={post} />

      {quoted && (
        <div className="panel overflow-hidden">
          <PostCard post={quoted} embedded />
        </div>
      )}

      <NewResponseForm postId={id} />

      {responsesLoading && <Loading label="Cargando respuestas…" />}
      {responses?.posts.map((response) => (
        <PostCard key={response.id} post={response} />
      ))}
    </div>
  );
}
