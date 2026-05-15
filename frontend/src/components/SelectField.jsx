const SelectField = ({ label, hint, error, children, ...props }) => (
  <label className="flex w-full flex-col gap-2 text-sm text-[var(--mc-text)]">
    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--mc-muted)]">{label}</span>
    <select
      {...props}
      className="rounded-2xl border border-[var(--mc-border)] bg-white/80 px-4 py-3 text-sm text-[var(--mc-text)] shadow-sm outline-none transition focus:border-[var(--mc-primary)] focus:ring-4 focus:ring-[var(--mc-primary)]/10 dark:bg-[var(--mc-surface-strong)]/50"
    >
      {children}
    </select>
    {hint ? <span className="text-xs text-[var(--mc-muted)]">{hint}</span> : null}
    {error ? <span className="text-xs text-rose-600 dark:text-rose-300">{error}</span> : null}
  </label>
);

export default SelectField;
