"use client";

import { useCreatePost } from "@/hooks/useCreatePost";
import { PostComposer } from "./PostComposer";

export function NewPostForm() {
  const createPost = useCreatePost();

  return (
    <PostComposer
      placeholder="¿Qué estás pensando?"
      buttonLabel="Publicar"
      isPending={createPost.isPending}
      onSubmit={(input, reset) => createPost.mutate(input, { onSuccess: reset })}
    />
  );
}
