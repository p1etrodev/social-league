import { isAxiosError } from "axios";
import { ddragonClient } from "./axios";
import { NotFoundError } from "./errors";

export type ChampionSummary = {
  id: string;
  name: string;
  title: string;
  blurb: string;
};

export async function fetchLatestVersion(): Promise<string> {
  const { data } = await ddragonClient.get("/realms/las.json");
  return data.dd as string;
}

export async function fetchChampions(): Promise<ChampionSummary[]> {
  const version = await fetchLatestVersion();
  const { data } = await ddragonClient.get(`/cdn/${version}/data/es_AR/champion.json`);
  return Object.values(data.data) as ChampionSummary[];
}

export async function fetchChampion(championId: string): Promise<ChampionSummary> {
  const version = await fetchLatestVersion();

  let data: { data?: Record<string, unknown> };
  try {
    ({ data } = await ddragonClient.get(`/cdn/${version}/data/es_AR/champion/${championId}.json`));
  } catch (error) {
    // Data Dragon's S3-backed CDN returns 403 AccessDenied (not 404) for a
    // champion id that doesn't exist as a static file.
    if (isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 404)) {
      throw new NotFoundError(`Champion ${championId} not found`);
    }
    throw error;
  }

  const champion = data.data?.[championId] as
    | { id: string; name: string; title: string; blurb: string }
    | undefined;
  if (!champion) {
    throw new NotFoundError(`Champion ${championId} not found in Data Dragon ${version}`);
  }

  return {
    id: champion.id,
    name: champion.name,
    title: champion.title,
    blurb: champion.blurb,
  };
}
