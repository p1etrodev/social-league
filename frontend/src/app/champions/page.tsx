import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { championsQueryOptions } from "@/hooks/useChampions";
import { getQueryClient } from "@/lib/query-client";
import { ChampionsGrid } from "./ChampionsGrid";

export const metadata: Metadata = {
  title: "Campeones",
  description:
    "Explorá todos los campeones de League of Legends y descubrí lo que se está diciendo de cada uno en Social League.",
};

export default async function ChampionsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(championsQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChampionsGrid />
    </HydrationBoundary>
  );
}
