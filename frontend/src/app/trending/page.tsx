import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { trendingPostsQueryOptions } from "@/hooks/useTrendingPosts";
import { getQueryClient } from "@/lib/query-client";
import { TrendingView } from "./TrendingView";

export const metadata: Metadata = {
  title: "Tendencias",
  description: "Los posts más citados y reposteados de las últimas 24 horas.",
};

export default async function TrendingPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trendingPostsQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrendingView />
    </HydrationBoundary>
  );
}
