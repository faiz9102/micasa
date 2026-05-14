import { useNavigate } from 'react-router';

const CornerNav = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#0B1326] text-xs uppercase tracking-[0.2em] text-[#D4A017] transition hover:border-[#D4A017]"
        aria-label="Go back"
        title="Back"
      >
        <span aria-hidden="true">&lt;</span>
      </button>
      <button
        type="button"
        onClick={() => navigate(1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#0B1326] text-xs uppercase tracking-[0.2em] text-[#D4A017] transition hover:border-[#D4A017]"
        aria-label="Go forward"
        title="Forward"
      >
        <span aria-hidden="true">&gt;</span>
      </button>
    </div>
  );
};

export default CornerNav;
