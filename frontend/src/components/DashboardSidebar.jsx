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
    <aside className="flex h-full flex-col gap-6 border-r border-white/10 bg-[#0B1326] px-6 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-[#D4A017]">{title}</p>
        <p className="mt-3 font-display text-2xl text-white">micasa</p>
      </div>
      <nav className="flex flex-1 flex-col gap-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-2xl px-4 py-3 text-xs uppercase tracking-[0.3em] transition ${
                isActive ? 'bg-[#D4A017] text-[#0B1326]' : 'text-slate-300 hover:bg-white/5'
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
        className="rounded-full border border-[#D4A017]/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#D4A017] transition hover:border-[#D4A017] hover:text-white"
      >
        Logout
      </button>
    </aside>
  );
};

export default DashboardSidebar;
