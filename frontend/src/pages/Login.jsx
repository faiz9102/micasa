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
    <div className="bg-[#0B1326]">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 md:flex-row">
        <div className="md:w-1/2">
          <p className="text-xs uppercase tracking-[0.4em] text-[#D4A017]">Secure access</p>
          <h1 className="mt-6 font-display text-4xl text-white">{loginMeta.label} login</h1>
          <p className="mt-4 text-sm text-slate-300/80">
            Sign in to manage your portfolio, listings, and client experiences.
          </p>
          <div className="mt-10 space-y-3 text-sm text-slate-300/80">
            <p>Buyer access · Discover curated properties.</p>
            <p>Seller access · Create and manage listings.</p>
            <p>Admin access · Oversee accounts and activity.</p>
          </div>
        </div>
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 md:w-1/2">
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
              className="w-full rounded-full bg-[#D4A017] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[#0B1326] transition hover:bg-[#e9c35e] disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="mt-8 text-xs uppercase tracking-[0.3em] text-slate-400">
            New here?{' '}
            <Link className="text-[#D4A017]" to="/register">
              Create account
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {['buyer', 'seller', 'admin'].map((linkRole) => (
              <Link
                key={linkRole}
                to={`/login/${linkRole}`}
                className="rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-slate-300 transition hover:border-[#D4A017] hover:text-white"
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
