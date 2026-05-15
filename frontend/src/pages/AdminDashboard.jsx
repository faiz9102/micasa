import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import InputField from '../components/InputField.jsx';
import SelectField from '../components/SelectField.jsx';
import InlineAlert from '../components/InlineAlert.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { createAccount, deactivateAccount, listAccounts } from '../services/accountService.js';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });

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
      setForm({ name: '', email: '', password: '', role: 'user' });
      loadUsers();
    } catch (err) {
      setError('Unable to create account.');
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
    <div className="space-y-10">
      <PageHeader
        title="Admin dashboard"
        subtitle="Monitor user activity, create accounts, and maintain listing integrity."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Total users" value={users.length} />
        <StatCard label="Active" value={activeUsers} />
        <StatCard label="Inactive" value={inactiveUsers} />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_1.2fr]">
        <div className="rounded-[2rem] border border-[var(--mc-border)] bg-[var(--mc-surface)] p-6 shadow-sm backdrop-blur-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--mc-accent)]">Create account</p>
          <h3 className="mt-4 font-display text-2xl text-[var(--mc-text)]">Add a new user or admin.</h3>
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
            <SelectField label="Role" name="role" value={form.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </SelectField>
            {error ? <InlineAlert variant="error" message={error} /> : null}
            {success ? <InlineAlert variant="success" message={success} /> : null}
            <button
              type="submit"
              className="w-full rounded-full bg-[var(--mc-primary)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-[var(--mc-primary-strong)]"
            >
              Create account
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] border border-[var(--mc-border)] bg-[var(--mc-surface)] p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--mc-accent)]">User directory</p>
              <p className="mt-2 text-sm text-[var(--mc-muted)]">Track and manage access.</p>
            </div>
            <button
              type="button"
              onClick={loadUsers}
              className="rounded-full border border-[var(--mc-border)] bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--mc-text)]"
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
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--mc-border)] bg-white/70 px-4 py-3 dark:bg-[var(--mc-surface-strong)]/30"
                >
                  <div>
                    <p className="text-sm text-[var(--mc-text)]">{user.name}</p>
                    <p className="text-xs text-[var(--mc-muted)]">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--mc-muted)]">
                    <span>{user.role}</span>
                    <span className="text-[var(--mc-muted)]/40">•</span>
                    <span>{user.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeactivate(user.id)}
                    className="rounded-full border border-[var(--mc-border)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--mc-text)] transition hover:border-[var(--mc-primary)] hover:text-[var(--mc-primary)]"
                  >
                    Deactivate
                  </button>
                </div>
              ))}
              {!users.length && <p className="text-sm text-[var(--mc-muted)]">No users found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
