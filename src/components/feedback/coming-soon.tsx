export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-panel border border-border-subtle bg-bg-1 px-6 py-16 text-center">
      <p className="font-display text-base font-semibold uppercase tracking-wide text-brand-cyan">
        {title}
      </p>
      <p className="max-w-sm text-sm text-text-secondary">{description}</p>
    </div>
  );
}
