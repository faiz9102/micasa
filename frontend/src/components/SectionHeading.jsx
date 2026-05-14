const SectionHeading = ({ eyebrow, title, subtitle }) => (
  <div className="flex flex-col gap-3">
    {eyebrow ? (
      <span className="text-xs uppercase tracking-[0.4em] text-[#D4A017]">{eyebrow}</span>
    ) : null}
    <h2 className="font-display text-3xl text-white md:text-4xl">{title}</h2>
    {subtitle ? <p className="max-w-2xl text-sm text-slate-300/80">{subtitle}</p> : null}
  </div>
);

export default SectionHeading;
