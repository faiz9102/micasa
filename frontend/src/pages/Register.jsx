import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import InputField from '../components/InputField.jsx';
import InlineAlert from '../components/InlineAlert.jsx';
import { createAccount } from '../services/accountService.js';

const Register = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (auth?.isAuthenticated) {
      navigate('/');
    }
  }, [auth?.isAuthenticated]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createAccount(form);
      setSuccess('Account created successfully. Please sign in.');
      setTimeout(() => navigate('/login/buyer'), 900);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 md:pt-0 px-6 py-10 md:py-16">
      <section className="mx-auto grid w-full max-w-6xl gap-10 rounded-4xl border-(--mc-border) bg-(--mc-surface) p-6 shadow-(--mc-shadow) backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr] md:p-10">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border-(--mc-border) bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">
            Create account
          </div>
          <h1 className="font-display text-4xl text-(--mc-text)">Join the micasa private network.</h1>
          <p className="max-w-md text-sm leading-7 text-(--mc-muted)">
            Access curated listings, market intelligence, and personalized advisory support.
          </p>
          <div className="rounded-3xl border-(--mc-border) bg-(--mc-surface) p-5 shadow-sm backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-(--mc-muted)">Why join</p>
            <div className="mt-4 grid gap-3 text-sm text-(--mc-text)">
              <p>• Private listing access</p>
              <p>• Tailored market intelligence</p>
              <p>• Advisory support for buyers and sellers</p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border-(--mc-border) bg-white/85 p-6 shadow-sm dark:bg-(--mc-surface-strong)/35 md:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              label="Full name"
              name="name"
              placeholder="Muhammad Ali"
              value={form.name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="you@gmail.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
            {error ? <InlineAlert variant="error" message={error} /> : null}
            {success ? <InlineAlert variant="success" message={success} /> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-(--mc-primary) px-4 py-2 sm:px-6 sm:py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-(--mc-primary-strong) disabled:opacity-70"
            >
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>
          <div className="mt-8 text-xs font-semibold uppercase tracking-[0.32em] text-(--mc-muted)">
            Already have access?{' '}
            <Link className="text-(--mc-primary)" to="/login/buyer">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
