const DDRAGON_BASE = "https://ddragon.leagueoflegends.com";

export type ChampionSummary = {
  id: string;
  name: string;
  title: string;
  blurb: string;
};

async function getLatestVersion(): Promise<string> {
  const res = await fetch(`${DDRAGON_BASE}/realms/las.json`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch Data Dragon version");
  const data = await res.json();
  return data.dd as string;
}

export async function getChampionSummary(championId: string): Promise<ChampionSummary | null> {
  const version = await getLatestVersion();
  const res = await fetch(`${DDRAGON_BASE}/cdn/${version}/data/es_AR/champion/${championId}.json`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;

  const data = await res.json();
  const champion = data.data?.[championId];
  if (!champion) return null;

  return {
    id: champion.id as string,
    name: champion.name as string,
    title: champion.title as string,
    blurb: champion.blurb as string,
  };
}
