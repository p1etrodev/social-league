"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { postQueryOptions, usePost } from "@/hooks/usePost";
import { usePostResponses } from "@/hooks/usePostResponses";
import { PostCard } from "@/components/PostCard";
import { NewResponseForm } from "@/components/NewResponseForm";

function RespondsToBanner({ parentId }: { parentId: string }) {
  const { data: parent } = useQuery(postQueryOptions(parentId));
  if (!parent) return null;

  return (
    <Link
      href={`/post/${parent.id}`}
      className="block border-b border-extra p-4 text-sm text-muted"
    >
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
    <div className="flex flex-1 flex-col">
      {post.responseOf && <RespondsToBanner parentId={post.responseOf} />}

      <PostCard post={post} />

      {quoted && (
        <div className="mx-4 mt-2 rounded border border-extra">
          <PostCard post={quoted} />
        </div>
      )}

      <NewResponseForm postId={id} />

      {responsesLoading && <p className="p-4 text-muted">Cargando respuestas...</p>}
      {responses?.posts.map((response) => (
        <PostCard key={response.id} post={response} />
      ))}
    </div>
  );
}
