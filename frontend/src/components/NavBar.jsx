import { useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '../features/auth/authSlice.js';
import { logout as logoutRequest } from '../services/authService.js';

const navLinkClass = ({ isActive }) =>
  `text-sm tracking-[0.2em] uppercase transition-colors ${
    isActive ? 'text-[#D4A017]' : 'text-slate-200/80 hover:text-white'
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1326]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-[0.4em] uppercase text-white">
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
                  className="hidden rounded-full border border-[#D4A017]/50 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#D4A017] transition hover:border-[#D4A017] hover:text-white md:inline-flex"
                >
                  Dashboard
                </Link>
              ) : null}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-[#D4A017] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#0B1326] transition hover:bg-[#e9c35e]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login/buyer"
                className="hidden rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white md:inline-flex"
              >
                Buyer Login
              </Link>
              <Link
                to="/login/admin"
                className="rounded-full bg-[#D4A017] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#0B1326] transition hover:bg-[#e9c35e]"
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
