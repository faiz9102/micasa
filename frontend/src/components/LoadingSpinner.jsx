const LoadingSpinner = ({ label = 'Loading' }) => (
  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A017]" />
    {label}
  </div>
);

export default LoadingSpinner;
