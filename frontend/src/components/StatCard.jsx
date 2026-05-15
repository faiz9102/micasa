const StatCard = ({ label, value, hint }) => (
  <div className="rounded-[1.75rem] border border-[var(--mc-border)] bg-[var(--mc-surface)] p-6 shadow-sm backdrop-blur-xl">
    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--mc-muted)]">{label}</p>
    <p className="mt-3 font-display text-3xl text-[var(--mc-text)]">{value}</p>
    {hint ? <p className="mt-2 text-xs text-[var(--mc-muted)]">{hint}</p> : null}
  </div>
);

export default StatCard;
