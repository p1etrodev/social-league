import { QueryClient, isServer } from "@tanstack/react-query";
import { cache } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

// On the server, React's cache() scopes this to a single request, so
// generateMetadata and the page component prefetching the same query
// within one render pass share a QueryClient instead of double-fetching.
const getServerQueryClient = cache(makeQueryClient);

export function getQueryClient() {
  if (isServer) return getServerQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
