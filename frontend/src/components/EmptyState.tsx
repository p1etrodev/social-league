export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="panel flex flex-col items-center gap-2 p-11 text-center">
      <div className="mb-1 flex size-10 rotate-45 items-center justify-center border-2 border-extra opacity-70">
        <span className="-rotate-45 font-heading text-base font-black text-extra">
          {title.charAt(0).toUpperCase()}
        </span>
      </div>

      <h4 className="font-bold text-muted">{title}</h4>
      <p className="max-w-60 text-sm text-muted/70">{message}</p>
    </div>
  );
}
