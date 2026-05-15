const SectionHeading = ({ eyebrow, title, subtitle }) => (
  <div className="flex flex-col gap-3">
    {eyebrow ? (
      <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--mc-accent)]">{eyebrow}</span>
    ) : null}
    <h2 className="font-display text-3xl text-[var(--mc-text)] md:text-4xl">{title}</h2>
    {subtitle ? <p className="max-w-2xl text-sm text-[var(--mc-muted)]">{subtitle}</p> : null}
  </div>
);

export default SectionHeading;
