const TextAreaField = ({ label, hint, error, ...props }) => (
  <label className="flex w-full flex-col gap-2 text-sm text-slate-200">
    <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</span>
    <textarea
      {...props}
      className="min-h-30 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#D4A017]/60 focus:outline-none"
    />
    {hint ? <span className="text-xs text-slate-400/80">{hint}</span> : null}
    {error ? <span className="text-xs text-red-300">{error}</span> : null}
  </label>
);

export default TextAreaField;
