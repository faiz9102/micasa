import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import InputField from '../components/InputField.jsx';
import InlineAlert from '../components/InlineAlert.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Badge from '../components/Badge.jsx';
import { formatCurrency } from '../utils/format.js';
import { activateAccount, createAccount, deactivateAccount, listAccounts, promoteUser, getAdminDashboardSummary } from '../services/accountService.js';
import { deleteProperty, listProperties, updateProperty } from '../services/propertyService.js';
import { listInquiries } from '../services/inquiryService.js';

const AdminDashboard = () => {
  const auth = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [promoteForm, setPromoteForm] = useState({ email: '', name: '' });
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [propertiesError, setPropertiesError] = useState('');
  const [propertiesSuccess, setPropertiesSuccess] = useState('');
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listAccounts();
      setUsers(data.users || []);
    } catch {
      setError('Unable to load users.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    setPropertiesLoading(true);
    setPropertiesError('');
    try {
      const data = await listProperties();
      setProperties(data.properties || []);
    } catch {
      setPropertiesError('Unable to load listings.');
      setProperties([]);
    } finally {
      setPropertiesLoading(false);
    }
  };

  const loadSummary = async () => {
    setSummaryLoading(true);
    setSummaryError('');
    try {
      const data = await getAdminDashboardSummary();
      if (data?.summary) {
        setDashboardSummary(data);
        return;
      }
      throw new Error('Invalid summary response');
    } catch {
      try {
        const [usersResponse, propertiesResponse] = await Promise.all([
          listAccounts(),
          listProperties(),
        ]);
        const usersList = usersResponse.users || [];
        const propertiesList = propertiesResponse.properties || [];
        const inquiriesLists = await Promise.all(
          propertiesList.map(async (property) => {
            try {
              const response = await listInquiries(property.id);
              return response.inquiries || [];
            } catch {
              return [];
            }
          })
        );

        const inquiries = inquiriesLists.flat();
        const usersById = new Map(usersList.map((user) => [user.id, user]));
        const propertiesById = new Map(propertiesList.map((property) => [property.id, property]));

        const inquiryStats = inquiries.reduce(
          (stats, inquiry) => {
            stats.total += 1;
            stats.byStatus[inquiry.status] = (stats.byStatus[inquiry.status] || 0) + 1;
            return stats;
          },
          {
            total: 0,
            byStatus: {
              new: 0,
              contacted: 0,
              scheduled_visit: 0,
              closed: 0,
            },
          }
        );

        const activity = [
          ...usersList.map((user) => ({
            type: 'account',
            title: `New account: ${user.name}`,
            description: user.email,
            createdAt: user.createdAt,
          })),
          ...propertiesList.map((property) => ({
            type: 'listing',
            title: `Listing: ${property.city}`,
            description: `${usersById.get(property.ownerId)?.name || 'Unknown seller'} · ${property.isActive ? 'Approved' : 'Pending review'}`,
            createdAt: property.createdAt,
          })),
          ...inquiries.map((inquiry) => ({
            type: 'inquiry',
            title: `Inquiry: ${inquiry.status}`,
            description: `${usersById.get(inquiry.tenantId)?.name || 'Unknown buyer'} · ${propertiesById.get(inquiry.propertyId)?.city || 'Unknown property'}`,
            createdAt: inquiry.createdAt,
          })),
        ]
          .sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0))
          .slice(0, 8);

        setDashboardSummary({
          summary: {
            totalListings: propertiesList.length,
            pendingListings: propertiesList.filter((property) => !property.isActive).length,
            approvedListings: propertiesList.filter((property) => property.isActive).length,
            totalInquiries: inquiryStats.total,
            inquiryStats: inquiryStats.byStatus,
          },
          recentActivity: activity,
        });
      } catch {
        setSummaryError('Unable to load dashboard statistics.');
        setDashboardSummary(null);
      }
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.hydrated || !auth.isAuthenticated) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      loadUsers();
      loadProperties();
      loadSummary();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [auth.hydrated, auth.isAuthenticated]);

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
    } catch {
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
    } catch {
      setError('Unable to promote user.');
    }
  };

  const handleToggleActive = async (user) => {
    setError('');
    setSuccess('');
    try {
      if (user.isActive) {
        await deactivateAccount(user.id);
        setSuccess('User deactivated.');
      } else {
        await activateAccount(user.id);
        setSuccess('User activated.');
      }
      loadUsers();
    } catch {
      setError('Unable to update user status.');
    }
  };

  const handleApproveListing = async (property) => {
    setPropertiesError('');
    setPropertiesSuccess('');
    try {
      await updateProperty(property.id, { isActive: true });
      setPropertiesSuccess('Listing approved.');
      loadProperties();
    } catch {
      setPropertiesError('Unable to approve listing.');
    }
  };

  const handleRemoveListing = async (property) => {
    setPropertiesError('');
    setPropertiesSuccess('');
    try {
      await deleteProperty(property.id);
      setPropertiesSuccess('Listing removed.');
      loadProperties();
    } catch {
      setPropertiesError('Unable to remove listing.');
    }
  };

  const activeUsers = users.filter((user) => user.isActive).length;
  const inactiveUsers = users.filter((user) => !user.isActive).length;
  const pendingListings = properties.filter((property) => !property.isActive);
  const approvedListings = properties.filter((property) => property.isActive);
  const summary = dashboardSummary?.summary;
  const recentActivity = dashboardSummary?.recentActivity || [];
  const inquiryStats = summary?.inquiryStats || {};

  const formatActivityDate = (value) => {
    if (!value) return 'Unknown time';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Unknown time' : date.toLocaleString();
  };

  return (
    <div className="pt-16 md:pt-0 space-y-10">
      {!auth.hydrated ? (
        <div className="rounded-4xl border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl">
          <LoadingSpinner label="Loading dashboard" />
        </div>
      ) : null}

      <PageHeader
        title="Admin dashboard"
        subtitle="Monitor user activity, review listings, approve submissions, and remove stale inventory."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Total users" value={users.length} />
        <StatCard label="Active" value={activeUsers} />
        <StatCard label="Inactive" value={inactiveUsers} />
      </div>

      <div className="rounded-4xl border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">Analytics</p>
            <h3 className="mt-4 font-display text-2xl text-(--mc-text)">Dashboard statistics</h3>
            <p className="mt-2 text-sm text-(--mc-muted)">Total listing counts, inquiry statistics, and recent activity.</p>
          </div>
          <button
            type="button"
            onClick={loadSummary}
            className="rounded-full border border-(--mc-border) bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-text)"
          >
            Refresh stats
          </button>
        </div>

        {summaryError ? (
          <div className="mt-6">
            <InlineAlert variant="error" message={summaryError} />
          </div>
        ) : null}

        {summaryLoading ? (
          <div className="mt-6">
            <LoadingSpinner label="Loading statistics" />
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <StatCard label="Total listings" value={summary?.totalListings ?? properties.length} />
              <StatCard label="Pending listings" value={summary?.pendingListings ?? pendingListings.length} />
              <StatCard label="Approved listings" value={summary?.approvedListings ?? approvedListings.length} />
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-4">
              <StatCard label="Total inquiries" value={summary?.totalInquiries ?? 0} />
              <StatCard label="New inquiries" value={inquiryStats.new ?? 0} />
              <StatCard label="Scheduled visits" value={inquiryStats.scheduled_visit ?? 0} />
              <StatCard label="Closed inquiries" value={inquiryStats.closed ?? 0} />
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">Recent activity</p>
                  <p className="mt-2 text-sm text-(--mc-muted)">Latest account, listing, and inquiry events.</p>
                </div>
              </div>

              <div className="space-y-3">
                {recentActivity.map((item, index) => (
                  <div
                    key={`${item.type}-${item.createdAt}-${index}`}
                    className="flex flex-col gap-2 rounded-2xl border border-(--mc-border) bg-white/70 px-4 py-3 text-sm shadow-sm dark:bg-(--mc-surface-strong)/30 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-semibold text-(--mc-text)">{item.title}</p>
                        <Badge label={item.type} />
                      </div>
                      <p className="text-(--mc-muted)">{item.description}</p>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--mc-muted)">
                      {formatActivityDate(item.createdAt)}
                    </p>
                  </div>
                ))}
                {!recentActivity.length ? <p className="text-sm text-(--mc-muted)">No recent activity found.</p> : null}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-4xl border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl">
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

        <div className="rounded-4xl border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl">
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
                    onClick={() => handleToggleActive(user)}
                    className="rounded-full border border-(--mc-border) px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-text) transition hover:border-(--mc-primary) hover:text-(--mc-primary)"
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              ))}
              {!users.length && <p className="text-sm text-(--mc-muted)">No users found.</p>}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-4xl border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">Listing review</p>
            <h3 className="mt-4 font-display text-2xl text-(--mc-text)">Review, approve, or remove properties.</h3>
            <p className="mt-2 text-sm text-(--mc-muted)">Pending listings stay hidden until you approve them.</p>
          </div>
          <button
            type="button"
            onClick={loadProperties}
            className="rounded-full border border-(--mc-border) bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-text)"
          >
            Refresh listings
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <StatCard label="Total listings" value={properties.length} />
          <StatCard label="Pending review" value={pendingListings.length} />
          <StatCard label="Approved" value={approvedListings.length} />
        </div>

        {propertiesError ? (
          <div className="mt-6">
            <InlineAlert variant="error" message={propertiesError} />
          </div>
        ) : null}
        {propertiesSuccess ? (
          <div className="mt-6">
            <InlineAlert variant="success" message={propertiesSuccess} />
          </div>
        ) : null}

        {propertiesLoading ? (
          <div className="mt-6">
            <LoadingSpinner label="Loading listings" />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex flex-col gap-4 rounded-2xl border border-(--mc-border) bg-white/70 p-4 shadow-sm dark:bg-(--mc-surface-strong)/30 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="font-display text-xl text-(--mc-text)">{property.city}</h4>
                    <Badge label={property.isActive ? 'Approved' : 'Pending review'} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-(--mc-muted)">
                    <span>{formatCurrency(property.price)}</span>
                    <span>{property.propertyType}</span>
                    <span>{property.purpose}</span>
                  </div>
                  <p className="max-w-3xl text-sm text-(--mc-muted)">{property.description}</p>
                  <Link
                    to={`/properties/${property.id}`}
                    className="inline-flex text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-primary) transition hover:text-(--mc-primary-strong)"
                  >
                    Review details
                  </Link>
                </div>

                <div className="flex flex-wrap gap-3">
                  {!property.isActive ? (
                    <button
                      type="button"
                      onClick={() => handleApproveListing(property)}
                      className="rounded-full bg-(--mc-primary) px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-(--mc-primary-strong)"
                    >
                      Approve
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleRemoveListing(property)}
                    className="rounded-full border border-(--mc-border) px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-text) transition hover:border-(--mc-primary) hover:text-(--mc-primary)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {!properties.length ? <p className="text-sm text-(--mc-muted)">No listings found.</p> : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;