const EmptyState = ({ title, description, action }) => (
  <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
    <h3 className="font-display text-2xl text-white">{title}</h3>
    {description ? <p className="mt-2 text-sm text-slate-300/80">{description}</p> : null}
    {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
  </div>
);

export default EmptyState;
