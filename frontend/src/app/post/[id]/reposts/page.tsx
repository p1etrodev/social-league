import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { postQueryOptions } from "@/hooks/usePost";
import { postRepostsQueryOptions } from "@/hooks/usePostReposts";
import { getQueryClient } from "@/lib/query-client";
import { isNotFoundError } from "@/lib/errors";
import { RepostsView } from "./RepostsView";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await getQueryClient().fetchQuery(postQueryOptions(id));
    const excerpt = post.content.slice(0, 40);
    return {
      title: `Reposts de "${excerpt}"`,
      description: `Todos los reposts del post: ${post.content.slice(0, 120)}`,
    };
  } catch (error) {
    if (isNotFoundError(error)) return { title: "Post no encontrado" };
    throw error;
  }
}

export default async function PostRepostsPage({ params }: Props) {
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

  await queryClient.prefetchInfiniteQuery(postRepostsQueryOptions(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RepostsView id={id} />
    </HydrationBoundary>
  );
}
