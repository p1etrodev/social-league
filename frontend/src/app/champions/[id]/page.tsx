import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getChampionSummary } from "@/lib/data-dragon";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const champion = await getChampionSummary(id);
  if (!champion) return { title: "Campeón no encontrado" };

  return {
    title: champion.name,
    description: `${champion.name}, ${champion.title}. ${champion.blurb}`.slice(0, 160),
    openGraph: {
      title: champion.name,
      description: champion.blurb,
    },
    twitter: {
      title: champion.name,
      description: champion.blurb,
    },
  };
}

export default async function ChampionProfilePage({ params }: Props) {
  const { id } = await params;
  const champion = await getChampionSummary(id);
  if (!champion) notFound();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <h1 className="font-heading text-3xl font-extrabold text-primary">{champion.name}</h1>
      <p className="text-muted">{champion.title}</p>
    </div>
  );
}
