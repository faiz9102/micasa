import { useNavigate } from 'react-router';

const CornerNav = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-(--mc-border) bg-(--mc-surface) text-xs uppercase tracking-[0.2em] text-(--mc-primary) shadow-sm transition hover:border-(--mc-primary) hover:bg-white"
        aria-label="Go back"
        title="Back"
      >
        <span aria-hidden="true">&lt;</span>
      </button>
      <button
        type="button"
        onClick={() => navigate(1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-(--mc-border) bg-(--mc-surface) text-xs uppercase tracking-[0.2em] text-(--mc-primary) shadow-sm transition hover:border-(--mc-primary) hover:bg-white"
        aria-label="Go forward"
        title="Forward"
      >
        <span aria-hidden="true">&gt;</span>
      </button>
    </div>
  );
};

export default CornerNav;
