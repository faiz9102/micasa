const TextAreaField = ({ label, hint, error, ...props }) => (
  <label className="flex w-full flex-col gap-2 text-sm text-[var(--mc-text)]">
    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--mc-muted)]">{label}</span>
    <textarea
      {...props}
      className="min-h-30 rounded-2xl border border-[var(--mc-border)] bg-white/80 px-4 py-3 text-sm text-[var(--mc-text)] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--mc-primary)] focus:ring-4 focus:ring-[var(--mc-primary)]/10 dark:bg-[var(--mc-surface-strong)]/50"
    />
    {hint ? <span className="text-xs text-[var(--mc-muted)]">{hint}</span> : null}
    {error ? <span className="text-xs text-rose-600 dark:text-rose-300">{error}</span> : null}
  </label>
);

export default TextAreaField;
