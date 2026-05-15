import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import InputField from '../components/InputField.jsx';
import InlineAlert from '../components/InlineAlert.jsx';
import { login as loginRequest } from '../services/authService.js';
import { loginSuccess } from '../features/auth/authSlice.js';

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loginMeta = useMemo(() => {
    if (role === 'admin') {
      return { apiRole: 'admin', label: 'Admin', roleValue: 'admin', loggedInAsSeller: false };
    }
    if (role === 'seller') {
      return { apiRole: 'seller', label: 'Seller', roleValue: 'user', loggedInAsSeller: true };
    }
    return { apiRole: 'buyer', label: 'Buyer', roleValue: 'user', loggedInAsSeller: false };
  }, [role]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginRequest(loginMeta.apiRole, form);
      dispatch(
        loginSuccess({
          user: data.user,
          role: loginMeta.roleValue,
          loggedInAsSeller: loginMeta.loggedInAsSeller,
          accessToken: data.accessToken,
        })
      );
      const fallbackRedirect = loginMeta.roleValue === 'admin'
        ? '/dashboard/admin'
        : loginMeta.loggedInAsSeller
          ? '/dashboard/user'
          : '/';
      const requestedPath = location.state?.from?.pathname;
      const allowRequested = requestedPath && (loginMeta.roleValue === 'admin' || loginMeta.loggedInAsSeller);
      const redirectTo = allowRequested ? requestedPath : fallbackRedirect;
      navigate(redirectTo);
    } catch (err) {
      setError('Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-10 md:py-16">
      <section className="mx-auto grid w-full max-w-6xl gap-10 rounded-[2rem] border border-[var(--mc-border)] bg-[var(--mc-surface)] p-6 shadow-[var(--mc-shadow)] backdrop-blur-xl md:grid-cols-[1fr_1fr] md:p-10">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-[var(--mc-border)] bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--mc-accent)]">
            Secure access
          </div>
          <h1 className="font-display text-4xl text-[var(--mc-text)]">{loginMeta.label} login</h1>
          <p className="max-w-md text-sm leading-7 text-[var(--mc-muted)]">
            Sign in to manage your portfolio, listings, and client experiences.
          </p>
          <div className="grid gap-3 text-sm text-[var(--mc-muted)]">
            <p>Buyer access · Discover curated properties.</p>
            <p>Seller access · Create and manage listings.</p>
            <p>Admin access · Oversee accounts and activity.</p>
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-[var(--mc-border)] bg-white/85 p-6 shadow-sm dark:bg-[var(--mc-surface-strong)]/35 md:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="you@micasa.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
            {error ? <InlineAlert variant="error" message={error} /> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[var(--mc-primary)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-[var(--mc-primary-strong)] disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="mt-8 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--mc-muted)]">
            New here?{' '}
            <Link className="text-[var(--mc-primary)]" to="/register">
              Create account
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {['buyer', 'seller', 'admin'].map((linkRole) => (
              <Link
                key={linkRole}
                to={`/login/${linkRole}`}
                className="rounded-full border border-[var(--mc-border)] bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--mc-text)] transition hover:border-[var(--mc-primary)] hover:text-[var(--mc-primary)]"
              >
                {linkRole}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
