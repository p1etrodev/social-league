import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { postQueryOptions } from "@/hooks/usePost";
import { getQueryClient } from "@/lib/query-client";
import { isNotFoundError } from "@/lib/errors";
import { PostView } from "./PostView";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await getQueryClient().fetchQuery(postQueryOptions(id));
    return {
      title: post.content.slice(0, 60),
      description: post.content.slice(0, 160),
      openGraph: { title: post.content.slice(0, 60), description: post.content.slice(0, 160) },
      twitter: { title: post.content.slice(0, 60), description: post.content.slice(0, 160) },
    };
  } catch (error) {
    if (isNotFoundError(error)) return { title: "Post no encontrado" };
    throw error;
  }
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const queryClient = getQueryClient();

  try {
    // fetchQuery (unlike prefetchQuery) rejects on error instead of
    // swallowing it, which is what lets us route to notFound() here.
    await queryClient.fetchQuery(postQueryOptions(id));
  } catch (error) {
    if (isNotFoundError(error)) notFound();
    throw error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostView id={id} />
    </HydrationBoundary>
  );
}
