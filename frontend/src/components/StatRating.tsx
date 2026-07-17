const MAX_RATING = 10;

export function StatRating({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-20 shrink-0 text-muted">{label}</span>
      <div className="flex gap-0.5" aria-label={`${label}: ${value} de ${MAX_RATING}`}>
        {Array.from({ length: MAX_RATING }, (_, index) => (
          <span key={index} className={index < value ? "text-primary" : "text-extra"} aria-hidden>
            ★
          </span>
        ))}
      </div>
    </div>
  );
}
