import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchLatestVersion } from "@/lib/data-dragon";

export function latestVersionQueryOptions() {
  return queryOptions({
    queryKey: ["ddragon", "version"],
    queryFn: fetchLatestVersion,
    staleTime: 60 * 60 * 1000,
  });
}

export function useLatestVersion() {
  return useQuery(latestVersionQueryOptions());
}
