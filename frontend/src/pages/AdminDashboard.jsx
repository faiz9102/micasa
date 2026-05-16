import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import InputField from '../components/InputField.jsx';
import SelectField from '../components/SelectField.jsx';
import InlineAlert from '../components/InlineAlert.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { createAccount, deactivateAccount, listAccounts, promoteUser } from '../services/accountService.js';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [promoteForm, setPromoteForm] = useState({ email: '', name: '' });

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listAccounts();
      setUsers(data.users || []);
    } catch (err) {
      setError('Unable to load users.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createAccount(form);
      setSuccess('Account created successfully.');
      setForm({ name: '', email: '', password: '' });
      loadUsers();
    } catch (err) {
      setError('Unable to create account.');
    }
  };

  const handlePromote = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      await promoteUser(promoteForm);
      setSuccess('User promoted to admin.');
      setPromoteForm({ email: '', name: '' });
      loadUsers();
    } catch (err) {
      setError('Unable to promote user.');
    }
  };

  const handleDeactivate = async (userId) => {
    setError('');
    setSuccess('');
    try {
      await deactivateAccount(userId);
      setSuccess('User deactivated.');
      loadUsers();
    } catch (err) {
      setError('Unable to deactivate user.');
    }
  };

  const activeUsers = users.filter((user) => user.isActive).length;
  const inactiveUsers = users.filter((user) => !user.isActive).length;

  return (
    <div className="pt-16 md:pt-0 space-y-10">
      <PageHeader
        title="Admin dashboard"
        subtitle="Monitor user activity, create accounts, and maintain listing integrity."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Total users" value={users.length} />
        <StatCard label="Active" value={activeUsers} />
        <StatCard label="Inactive" value={inactiveUsers} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-[2rem] border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">Create account</p>
          <h3 className="mt-4 font-display text-2xl text-(--mc-text)">Add a new user or admin.</h3>
          <form className="mt-6 space-y-4" onSubmit={handleCreate}>
            <InputField label="Name" name="name" value={form.name} onChange={handleChange} required />
            <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {/* Role removed. Admins promote existing users instead of creating admin accounts. */}
            {error ? <InlineAlert variant="error" message={error} /> : null}
            {success ? <InlineAlert variant="success" message={success} /> : null}
            <button
              type="submit"
              className="w-full rounded-full bg-(--mc-primary) px-4 py-2 sm:px-6 sm:py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-(--mc-primary-strong)"
            >
              Create account
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl">
          <div className="mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">Promote user</p>
            <p className="mt-2 text-sm text-(--mc-muted)">Promote an existing user to admin using email or name.</p>
            <form className="mt-4 flex flex-col sm:flex-row gap-2" onSubmit={handlePromote}>
              <InputField label="Email" name="email" type="email" value={promoteForm.email} onChange={(e) => setPromoteForm((p) => ({ ...p, email: e.target.value }))} />
              <InputField label="Name" name="name" value={promoteForm.name} onChange={(e) => setPromoteForm((p) => ({ ...p, name: e.target.value }))} />
              <button type="submit" className="rounded-full border border-(--mc-border) px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-text)">Promote</button>
            </form>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">User directory</p>
              <p className="mt-2 text-sm text-(--mc-muted)">Track and manage access.</p>
            </div>
            <button
              type="button"
              onClick={loadUsers}
              className="rounded-full border border-(--mc-border) bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-text)"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="mt-6">
              <LoadingSpinner label="Loading users" />
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-(--mc-border) bg-white/70 px-4 py-3 dark:bg-(--mc-surface-strong)/30"
                >
                  <div>
                    <p className="text-sm text-(--mc-text)">{user.name}</p>
                    <p className="text-xs text-(--mc-muted)">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-muted)">
                    <span>{user.role}</span>
                    <span className="text-(--mc-muted)/40">•</span>
                    <span>{user.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeactivate(user.id)}
                    className="rounded-full border border-(--mc-border) px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-text) transition hover:border-(--mc-primary) hover:text-(--mc-primary)"
                  >
                    Deactivate
                  </button>
                </div>
              ))}
              {!users.length && <p className="text-sm text-(--mc-muted)">No users found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
