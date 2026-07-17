import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campeones",
  description:
    "Explorá todos los campeones de League of Legends y descubrí lo que se está diciendo de cada uno en Social League.",
};

export default function ChampionsPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-muted">Listado de campeones — próximamente.</p>
    </div>
  );
}
