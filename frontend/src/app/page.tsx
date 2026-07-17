import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio",
};

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <h1 className="font-heading text-3xl font-extrabold text-primary">Social League</h1>
    </div>
  );
}
