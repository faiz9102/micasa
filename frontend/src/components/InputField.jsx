const InputField = ({ label, hint, error, ...props }) => (
  <label className="flex w-full flex-col gap-2 text-sm text-(--mc-text)">
    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-(--mc-muted)">{label}</span>
    <input
      {...props}
      className="rounded-2xl border border-(--mc-border) bg-white/80 px-3 py-2 sm:px-4 sm:py-3 text-sm text-(--mc-text) shadow-sm outline-none transition placeholder:text-slate-400 focus:border-(--mc-primary) focus:ring-4 focus:ring-(--mc-primary)/10 dark:bg-(--mc-surface-strong)/50"
    />
    {hint ? <span className="text-xs text-(--mc-muted)">{hint}</span> : null}
    {error ? <span className="text-xs text-rose-600 dark:text-rose-300">{error}</span> : null}
  </label>
);

export default InputField;
