const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-wrap items-end justify-between gap-4">
    <div>
      <p className="text-xs uppercase tracking-[0.4em] text-[#D4A017]">micasa</p>
      <h1 className="mt-3 font-display text-3xl text-white md:text-4xl">{title}</h1>
      {subtitle ? <p className="mt-2 text-sm text-slate-300/80">{subtitle}</p> : null}
    </div>
    {action ? <div>{action}</div> : null}
  </div>
);

export default PageHeader;
