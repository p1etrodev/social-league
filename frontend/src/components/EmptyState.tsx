export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="panel flex flex-col items-center gap-2 p-11 text-center">
      <div className="mb-1 size-10 rotate-45 border-2 border-extra opacity-70" />

      <h4 className="font-bold text-muted">{title}</h4>
      <p className="max-w-60 text-sm text-muted/70">{message}</p>
    </div>
  );
}
