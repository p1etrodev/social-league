import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { postsQueryOptions } from "@/hooks/usePosts";
import { getQueryClient } from "@/lib/query-client";
import { HomeFeed } from "./HomeFeed";

export const metadata: Metadata = {
  title: "Inicio",
};

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(postsQueryOptions({ includeResponses: true }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeFeed />
    </HydrationBoundary>
  );
}
