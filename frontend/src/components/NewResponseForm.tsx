"use client";

import { useCreateResponse } from "@/hooks/useCreateResponse";
import { PostComposer } from "./PostComposer";

export function NewResponseForm({ postId }: { postId: string }) {
  const createResponse = useCreateResponse(postId);

  return (
    <PostComposer
      placeholder="Escribí una respuesta"
      buttonLabel="Responder"
      isPending={createResponse.isPending}
      onSubmit={(input, reset) => createResponse.mutate(input, { onSuccess: reset })}
    />
  );
}
