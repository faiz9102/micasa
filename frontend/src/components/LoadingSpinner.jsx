const LoadingSpinner = ({ label = 'Loading' }) => (
  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-(--mc-muted)">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--mc-border) border-t-(--mc-primary)" />
    {label}
  </div>
);

export default LoadingSpinner;
