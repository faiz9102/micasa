import { useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '../features/auth/authSlice.js';
import { logout as logoutRequest } from '../services/authService.js';

const navLinkClass = ({ isActive }) =>
  `text-[11px] font-semibold uppercase tracking-[0.32em] transition-colors ${
    isActive ? 'text-[var(--mc-primary)]' : 'text-[var(--mc-muted)] hover:text-[var(--mc-text)]'
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
    <header className="sticky top-0 z-50 border-b border-[var(--mc-border)] bg-[var(--mc-surface)]/90 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold uppercase tracking-[0.42em] text-[var(--mc-text)]">
          micasa
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/properties" className={navLinkClass}>
            Properties
          </NavLink>
          <NavLink to="/login/buyer" className={navLinkClass}>
            Login
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {auth.isAuthenticated ? (
            <>
              {dashboardPath ? (
                <Link
                  to={dashboardPath}
                  className="hidden rounded-full border border-[var(--mc-border)] bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[var(--mc-text)] transition hover:border-[var(--mc-primary)] hover:text-[var(--mc-primary)] md:inline-flex"
                >
                  Dashboard
                </Link>
              ) : null}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-[var(--mc-primary)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[var(--mc-primary-strong)]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login/buyer"
                className="hidden rounded-full border border-[var(--mc-border)] bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[var(--mc-text)] transition hover:border-[var(--mc-primary)] hover:text-[var(--mc-primary)] md:inline-flex"
              >
                Buyer Login
              </Link>
              <Link
                to="/login/admin"
                className="rounded-full bg-[var(--mc-primary)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[var(--mc-primary-strong)]"
              >
                Admin
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
