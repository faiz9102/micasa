import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import InputField from '../components/InputField.jsx';
import SelectField from '../components/SelectField.jsx';
import InlineAlert from '../components/InlineAlert.jsx';
import { createAccount } from '../services/accountService.js';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    <div className="bg-[#0B1326]">
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#D4A017]">Create account</p>
            <h1 className="mt-6 font-display text-4xl text-white">Join the micasa private network.</h1>
            <p className="mt-4 text-sm text-slate-300/80">
              Access curated listings, market intelligence, and personalized advisory support.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
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
              <SelectField label="Account type" name="role" value={form.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin" >Admin (first account only)</option>
              </SelectField>
              {error ? <InlineAlert variant="error" message={error} /> : null}
              {success ? <InlineAlert variant="success" message={success} /> : null}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#D4A017] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[#0B1326] transition hover:bg-[#e9c35e] disabled:opacity-70"
              >
                {loading ? 'Creating...' : 'Create account'}
              </button>
            </form>
            <div className="mt-8 text-xs uppercase tracking-[0.3em] text-slate-400">
              Already have access?{' '}
              <Link className="text-[#D4A017]" to="/login/buyer">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
