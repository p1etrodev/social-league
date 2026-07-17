const MAX_RATING = 10;

export function StatRating({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="flex items-center gap-2 text-sm"
      aria-label={`${label}: ${value} de ${MAX_RATING}`}
    >
      <span className="w-16 shrink-0 font-bold text-muted">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-extra/15" aria-hidden>
        <div
          className="h-full rounded-full bg-gradient-to-r from-extra to-primary-bright"
          style={{ width: `${(value / MAX_RATING) * 100}%` }}
        />
      </div>
      <span className="w-6 shrink-0 text-right font-mono text-xs text-muted" aria-hidden>
        {value}
      </span>
    </div>
  );
}
