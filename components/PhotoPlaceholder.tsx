/** Stand-in for a real photo that hasn't been supplied yet. */
export function PhotoPlaceholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-sand p-4 text-center text-ink/75 ${className}`} role="img" aria-label={label}>
      <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em]">{label}</span>
    </div>
  );
}
