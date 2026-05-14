const InlineAlert = ({ variant = 'info', message }) => {
  const styles = {
    info: 'border-[#D4A017]/30 text-[#D4A017]',
    error: 'border-red-500/40 text-red-300',
    success: 'border-emerald-500/40 text-emerald-200',
  };

  if (!message) return null;

  return (
    <div className={`rounded-2xl border bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.3em] ${styles[variant]}`}>
      {message}
    </div>
  );
};

export default InlineAlert;
