import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { championQueryOptions } from "@/hooks/useChampion";
import { getQueryClient } from "@/lib/query-client";
import { isNotFoundError } from "@/lib/errors";
import { ChampionView } from "./ChampionView";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const champion = await getQueryClient().fetchQuery(championQueryOptions(id));
    return {
      title: champion.name,
      description: `${champion.name}, ${champion.title}. ${champion.blurb}`.slice(0, 160),
      openGraph: { title: champion.name, description: champion.blurb },
      twitter: { title: champion.name, description: champion.blurb },
    };
  } catch (error) {
    if (isNotFoundError(error)) return { title: "Campeón no encontrado" };
    throw error;
  }
}

export default async function ChampionProfilePage({ params }: Props) {
  const { id } = await params;
  const queryClient = getQueryClient();

  try {
    // fetchQuery (unlike prefetchQuery) rejects on error instead of
    // swallowing it, which is what lets us route to notFound() here.
    await queryClient.fetchQuery(championQueryOptions(id));
  } catch (error) {
    if (isNotFoundError(error)) notFound();
    throw error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChampionView id={id} />
    </HydrationBoundary>
  );
}
