import { isAxiosError } from "axios";
import { ddragonClient } from "./axios";
import { NotFoundError } from "./errors";

export type ChampionSummary = {
  id: string;
  name: string;
  title: string;
  blurb: string;
};

export type Spell = {
  name: string;
  description: string;
  image: { full: string };
};

export type ChampionDetail = ChampionSummary & {
  tags: string[];
  info: { attack: number; defense: number; magic: number; difficulty: number };
  lore: string;
  passive: Spell;
  spells: Spell[];
  /** Skin numbers, excluding the default skin (0). */
  skins: number[];
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

async function getChampionRawData(championId: string, version: string) {
  try {
    const { data } = await ddragonClient.get(
      `/cdn/${version}/data/es_AR/champion/${championId}.json`,
    );
    return data.data?.[championId] as Record<string, unknown> | undefined;
  } catch (error) {
    // Data Dragon's S3-backed CDN returns 403 AccessDenied (not 404) for a
    // champion id that doesn't exist as a static file.
    if (isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 404)) {
      throw new NotFoundError(`Champion ${championId} not found`);
    }
    throw error;
  }
}

export async function fetchChampion(championId: string): Promise<ChampionDetail> {
  const version = await fetchLatestVersion();
  const champion = await getChampionRawData(championId, version);
  if (!champion) {
    throw new NotFoundError(`Champion ${championId} not found in Data Dragon ${version}`);
  }

  const skins = (champion.skins as { num: number }[] | undefined) ?? [];

  return {
    id: champion.id as string,
    name: champion.name as string,
    title: champion.title as string,
    blurb: champion.blurb as string,
    tags: champion.tags as string[],
    info: champion.info as ChampionDetail["info"],
    lore: champion.lore as string,
    passive: champion.passive as Spell,
    spells: champion.spells as Spell[],
    skins: skins.slice(1).map((skin) => skin.num),
  };
}

const DDRAGON_CDN = "https://ddragon.leagueoflegends.com";

export function championIconUrl(version: string, championId: string): string {
  return `${DDRAGON_CDN}/cdn/${version}/img/champion/${championId}.png`;
}

export function championLoadingUrl(championId: string): string {
  return `${DDRAGON_CDN}/cdn/img/champion/loading/${championId}_0.jpg`;
}

export function championSplashUrl(championId: string, skinNumber = 0): string {
  return `${DDRAGON_CDN}/cdn/img/champion/splash/${championId}_${skinNumber}.jpg`;
}

export function spellIconUrl(
  version: string,
  type: "spell" | "passive",
  imageFile: string,
): string {
  return `${DDRAGON_CDN}/cdn/${version}/img/${type}/${imageFile}`;
}
