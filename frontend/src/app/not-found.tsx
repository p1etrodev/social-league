import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-heading text-3xl font-extrabold text-primary">404</h1>
      <p className="text-muted">No encontramos lo que buscabas.</p>
      <Link href="/" className="text-secondary underline">
        Volver al inicio
      </Link>
    </div>
  );
}
