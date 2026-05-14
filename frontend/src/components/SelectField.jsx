const SelectField = ({ label, hint, error, children, ...props }) => (
  <label className="flex w-full flex-col gap-2 text-sm text-slate-200">
    <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</span>
    <select
      {...props}
      className="rounded-2xl border border-white/10 bg-[var(--mc-navy-soft)] px-4 py-3 text-sm text-[var(--mc-gold)] focus:border-[var(--mc-gold)]/70 focus:outline-none"
    >
      {children}
    </select>
    {hint ? <span className="text-xs text-slate-400/80">{hint}</span> : null}
    {error ? <span className="text-xs text-red-300">{error}</span> : null}
  </label>
);

export default SelectField;
