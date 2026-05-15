const LoadingSpinner = ({ label = 'Loading' }) => (
  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--mc-muted)]">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--mc-border)] border-t-[var(--mc-primary)]" />
    {label}
  </div>
);

export default LoadingSpinner;
