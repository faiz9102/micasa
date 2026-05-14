const StatCard = ({ label, value, hint }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
    <p className="mt-3 font-display text-3xl text-white">{value}</p>
    {hint ? <p className="mt-2 text-xs text-slate-400/80">{hint}</p> : null}
  </div>
);

export default StatCard;
