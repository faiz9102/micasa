const SectionHeading = ({ eyebrow, title, subtitle }) => (
  <div className="flex flex-col gap-3">
    {eyebrow ? (
      <span className="text-xs font-semibold uppercase tracking-[0.4em] text-(--mc-accent)">{eyebrow}</span>
    ) : null}
    <h2 className="font-display text-3xl text-(--mc-text) md:text-4xl">{title}</h2>
    {subtitle ? <p className="max-w-2xl text-sm text-(--mc-muted)">{subtitle}</p> : null}
  </div>
);

export default SectionHeading;
