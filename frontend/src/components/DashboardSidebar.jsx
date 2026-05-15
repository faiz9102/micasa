import { NavLink, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../features/auth/authSlice.js';
import { logout as logoutRequest } from '../services/authService.js';

const DashboardSidebar = ({ items, title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
    } finally {
      dispatch(logoutAction());
      navigate('/');
    }
  };

  return (
    <aside className="relative z-10 flex h-full flex-col gap-6 border-r border-[var(--mc-border)] bg-[var(--mc-surface)] px-6 py-10 backdrop-blur-2xl md:sticky md:top-0 md:h-screen">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--mc-accent)]">{title}</p>
        <p className="mt-3 font-display text-2xl text-[var(--mc-text)]">micasa</p>
      </div>
      <nav className="flex flex-1 flex-col gap-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-2xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] transition ${
                isActive
                  ? 'bg-[var(--mc-primary)] text-white shadow-sm'
                  : 'text-[var(--mc-muted)] hover:bg-white/70 hover:text-[var(--mc-text)]'
              }`
            }
            end={item.end}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full border border-[var(--mc-border)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--mc-text)] transition hover:border-[var(--mc-primary)] hover:text-[var(--mc-primary)]"
      >
        Logout
      </button>
    </aside>
  );
};

export default DashboardSidebar;
