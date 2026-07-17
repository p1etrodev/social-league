"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-heading text-3xl font-extrabold text-primary">Algo salió mal</h1>
      <p className="text-muted">No pudimos cargar esta página. Probá de nuevo en un momento.</p>
      <button type="button" onClick={() => reset()} className="text-secondary underline">
        Reintentar
      </button>
    </div>
  );
}
