const InlineAlert = ({ variant = 'info', message }) => {
  const styles = {
    info: 'border-(--mc-primary)/20 bg-(--mc-primary)/8 text-(--mc-primary)',
    error: 'border-rose-500/30 bg-rose-500/8 text-rose-700 dark:text-rose-200',
    success: 'border-emerald-500/30 bg-emerald-500/8 text-emerald-700 dark:text-emerald-200',
  };

  if (!message) return null;

  return (
    <div className={`rounded-2xl border px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] ${styles[variant]}`}>
      {message}
    </div>
  );
};

export default InlineAlert;
