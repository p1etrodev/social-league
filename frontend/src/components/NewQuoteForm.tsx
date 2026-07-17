"use client";

import type { Post } from "@/lib/api";
import { useCreateQuote } from "@/hooks/useCreateQuote";
import { PostCard } from "./PostCard";
import { PostComposer } from "./PostComposer";

export function NewQuoteForm({ post, onClose }: { post: Post; onClose: () => void }) {
  const createQuote = useCreateQuote(post.id);

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-primary">Citar post</h2>
        <button type="button" onClick={onClose} className="text-muted hover:text-paper">
          Cerrar
        </button>
      </div>

      <div className="panel overflow-hidden">
        <PostCard post={post} embedded />
      </div>

      <PostComposer
        placeholder="Escribí una cita"
        buttonLabel="Citar"
        isPending={createQuote.isPending}
        onSubmit={(input, reset) =>
          createQuote.mutate(input, {
            onSuccess: () => {
              reset();
              onClose();
            },
          })
        }
        bare
      />
    </div>
  );
}
