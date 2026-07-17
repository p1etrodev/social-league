export function Loading({ label = "Sincronizando con la Grieta…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 p-11">
      <div className="relative size-14">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-extra/30 border-t-primary" />
        <div className="animate-hex-pulse absolute inset-0 m-auto size-5 rotate-45 rounded-sm bg-gradient-to-br from-secondary-bright to-secondary" />
      </div>
      <p className="font-mono text-sm tracking-wide text-muted">{label}</p>
    </div>
  );
}
