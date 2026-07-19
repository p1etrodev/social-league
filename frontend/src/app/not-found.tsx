import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
      <span className="font-heading text-7xl font-black text-primary-bright drop-shadow-[0_0_34px_rgba(216,180,92,0.4)]">
        404
      </span>
      <div className="relative my-2 h-px w-22 bg-gradient-to-r from-transparent via-primary to-transparent">
        <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-primary" />
      </div>
      <h1 className="font-bold text-paper">No encontramos lo que buscabas.</h1>
      <p className="max-w-70 text-sm text-muted">
        Puede que el enlace esté roto o la página ya no exista. Volvé al inicio para seguir
        explorando.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-[10px] border border-extra/15 bg-surface/70 px-4 py-2.5 text-sm font-bold text-paper backdrop-blur-sm hover:border-extra/40"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
