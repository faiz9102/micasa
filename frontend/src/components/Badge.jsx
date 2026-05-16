const Badge = ({ label }) => (
  <span className="rounded-full border border-(--mc-border) bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-text) shadow-sm dark:bg-(--mc-surface-strong)/35">
    {label}
  </span>
);

export default Badge;
