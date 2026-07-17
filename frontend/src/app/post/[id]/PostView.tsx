"use client";

import { usePost } from "@/hooks/usePost";

export function PostView({ id }: { id: string }) {
  const { data: post } = usePost(id);

  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="max-w-lg text-center text-paper">{post.content}</p>
    </div>
  );
}
