import { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '../features/auth/authSlice.js';
import { logout as logoutRequest } from '../services/authService.js';

const navLinkClass = ({ isActive }) =>
  `text-[11px] font-semibold uppercase tracking-[0.32em] transition-colors ${
    isActive ? 'text-(--mc-primary)' : 'text-(--mc-muted) hover:text-(--mc-text)'
  }`;

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const dashboardPath = useMemo(() => {
    if (!auth.isAuthenticated) return null;
    if (auth.role === 'admin') return '/dashboard/admin';
    if (auth.loggedInAsSeller) return '/dashboard/user';
    return null;
  }, [auth.isAuthenticated, auth.role, auth.loggedInAsSeller]);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      void error;
    } finally {
      dispatch(logoutAction());
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-(--mc-border) bg-(--mc-surface)/90 backdrop-blur-2xl">
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold uppercase tracking-[0.42em] text-(--mc-text)">
          micasa
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/properties" className={navLinkClass}>
            Properties
          </NavLink>
          {!auth.isAuthenticated && (
            <NavLink to="/login/buyer" className={navLinkClass}>
              Login
            </NavLink>
          )}
        </nav>
        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-(--mc-border) bg-white/70 p-2 md:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            {open ? (
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 100 2h12a1 1 0 100-2H4z" clipRule="evenodd" />
            )}
          </svg>
        </button>
        <div className="flex items-center gap-3">
          {auth.isAuthenticated ? (
            <>
              {dashboardPath ? (
                <Link
                  to={dashboardPath}
                  className="hidden rounded-full border border-(--mc-border) bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-(--mc-text) transition hover:border-(--mc-primary) hover:text-(--mc-primary) md:inline-flex"
                >
                  Dashboard
                </Link>
              ) : null}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-(--mc-primary) px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-(--mc-primary-strong)"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login/buyer"
                className="hidden rounded-full border border-(--mc-border) bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-(--mc-text) transition hover:border-(--mc-primary) hover:text-(--mc-primary) md:inline-flex"
              >
                Buyer Login
              </Link>
              <Link
                to="/login/admin"
                className="rounded-full bg-(--mc-primary) px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-(--mc-primary-strong)"
              >
                Admin
              </Link>
            </>
          )}
        </div>
      </div>

        {/* Mobile menu dropdown (positioned under header content) */}
        {open && (
          <div className="md:hidden absolute left-0 right-0 top-full z-50 border-b border-(--mc-border) bg-(--mc-surface)/95 p-3 backdrop-blur-md">
            <nav className="flex flex-col gap-2">
              <NavLink to="/" className={navLinkClass} end onClick={() => setOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/properties" className={navLinkClass} onClick={() => setOpen(false)}>
                Properties
              </NavLink>
              {!auth.isAuthenticated && (
                <NavLink to="/login/buyer" className={navLinkClass} onClick={() => setOpen(false)}>
                  Login
                </NavLink>
              )}
            </nav>
          </div>
        )}
    </header>
  );
};

export default NavBar;
