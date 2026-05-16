const EmptyState = ({ title, description, action }) => (
  <div className="rounded-[2rem] border border-dashed border-(--mc-border) bg-(--mc-surface) p-8 text-center shadow-sm backdrop-blur-xl">
    <h3 className="font-display text-2xl text-(--mc-text)">{title}</h3>
    {description ? <p className="mt-2 text-sm text-(--mc-muted)">{description}</p> : null}
    {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
  </div>
);

export default EmptyState;
