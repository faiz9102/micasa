import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import PageHeader from '../components/PageHeader.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import InlineAlert from '../components/InlineAlert.jsx';
import Badge from '../components/Badge.jsx';
import { listProperties } from '../services/propertyService.js';
import { getFavorites } from '../utils/favorites.js';
import { listInquiries, scheduleInquiry, closeInquiry } from '../services/inquiryService.js';

const UserDashboard = () => {
  const auth = useSelector((state) => state.auth);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(() => getFavorites());
  const [incomingInquiries, setIncomingInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiriesError, setInquiriesError] = useState('');
  const [inquiryForms, setInquiryForms] = useState({});

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await listProperties();
      setProperties(data.properties || []);
    } catch (error) {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    const loadIncomingInquiries = async () => {
      if (!auth.user?.id || !(auth.loggedInAsSeller || auth.role === 'admin')) {
        setIncomingInquiries([]);
        return;
      }

      const ownedProperties = properties.filter((property) => property.ownerId === auth.user.id);
      if (!ownedProperties.length) {
        setIncomingInquiries([]);
        return;
      }

      setInquiriesLoading(true);
      setInquiriesError('');
      try {
        const inquiryGroups = await Promise.all(
          ownedProperties.map(async (property) => {
            try {
              const data = await listInquiries(property.id);
              return (data.inquiries || []).map((inquiry) => ({ ...inquiry, property }));
            } catch (e) {
              return [];
            }
          })
        );

        const flattened = inquiryGroups.flat().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setIncomingInquiries(flattened);
        setInquiryForms((prev) => {
          const next = { ...prev };
          flattened.forEach((inq) => {
            if (!next[inq.id]) {
              next[inq.id] = {
                scheduledVisitDate: inq.requestedVisitDate || '',
                scheduledVisitTime: inq.requestedVisitTime || '',
              };
            }
          });
          return next;
        });
      } catch (err) {
        setInquiriesError('Unable to load inquiries.');
        setIncomingInquiries([]);
      } finally {
        setInquiriesLoading(false);
      }
    };

    loadIncomingInquiries();
  }, [properties, auth.user?.id, auth.loggedInAsSeller, auth.role]);

  const myListings = useMemo(() => {
    if (!auth.user?.id) return [];
    return properties.filter((property) => property.ownerId === auth.user.id);
  }, [auth.user, properties]);

  const favoriteProperties = useMemo(
    () => properties.filter((property) => favoriteIds.includes(property.id)),
    [properties, favoriteIds]
  );

  const refreshFavorites = () => {
    setFavoriteIds(getFavorites());
  };

  const handleInquiryFieldChange = (inquiryId, field, value) => {
    setInquiryForms((prev) => ({
      ...prev,
      [inquiryId]: {
        ...(prev[inquiryId] || {}),
        [field]: value,
      },
    }));
  };

  const handleRespondInquiry = async (propertyId, inquiryId) => {
    setInquiriesError('');
    try {
      const form = inquiryForms[inquiryId] || {};
      const date = form.scheduledVisitDate || '';
      let time = form.scheduledVisitTime || '';

      if (!date || !time) {
        setInquiriesError('Please provide a scheduled date and time before responding.');
        return;
      }

      // Normalize MM/DD/YYYY to YYYY-MM-DD
      let sendDate = date;
      const mdyMatch = date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (mdyMatch) {
        const mm = mdyMatch[1].padStart(2, '0');
        const dd = mdyMatch[2].padStart(2, '0');
        const yyyy = mdyMatch[3];
        sendDate = `${yyyy}-${mm}-${dd}`;
      }

      // Normalize AM/PM to 24-hour HH:MM
      const ampmMatch = time.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
      if (ampmMatch) {
        let hh = parseInt(ampmMatch[1], 10);
        const mm = ampmMatch[2];
        const ampm = ampmMatch[3].toLowerCase();
        if (ampm === 'pm' && hh !== 12) hh = hh + 12;
        if (ampm === 'am' && hh === 12) hh = 0;
        time = `${String(hh).padStart(2, '0')}:${mm}`;
      }

      if (!/^\d{2}:\d{2}$/.test(time)) {
        setInquiriesError('Invalid time format. Use HH:MM.');
        return;
      }

      await scheduleInquiry(propertyId, inquiryId, {
        scheduledVisitDate: sendDate,
        scheduledVisitTime: time,
      });

      // reload
      const data = await listInquiries(propertyId);
      const updated = (data.inquiries || []).map((inq) => ({ ...inq, property: properties.find((p) => p.id === propertyId) }));
      setIncomingInquiries((prev) => {
        const others = prev.filter((i) => i.propertyId !== propertyId);
        return [...others, ...updated].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Unable to respond to inquiry.';
      setInquiriesError(msg);
    }
  };

  const handleCloseInquiry = async (propertyId, inquiryId) => {
    setInquiriesError('');
    try {
      await closeInquiry(propertyId, inquiryId);
      const data = await listInquiries(propertyId);
      const updated = (data.inquiries || []).map((inq) => ({ ...inq, property: properties.find((p) => p.id === propertyId) }));
      setIncomingInquiries((prev) => {
        const others = prev.filter((i) => i.propertyId !== propertyId);
        return [...others, ...updated].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Unable to close inquiry.';
      setInquiriesError(msg);
    }
  };

  const isBuyer = auth.role !== 'admin' && !auth.loggedInAsSeller;

  return (
    <div className="space-y-10">
      <PageHeader
        title={`Welcome back, ${auth.user?.name || 'Client'}`}
        subtitle="Review your profile and manage your listings."
        action={
          auth.loggedInAsSeller || auth.role === 'admin' ? (
            <Link
              to="/dashboard/user/properties/new"
              className="rounded-full bg-(--mc-primary) px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-(--mc-primary-strong)"
            >
              Create listing
            </Link>
          ) : null
        }
      />

      <div className="rounded-4xl border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">Profile</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-muted)">Name</p>
            <p className="mt-2 text-sm text-(--mc-text)">{auth.user?.name || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-muted)">Email</p>
            <p className="mt-2 text-sm text-(--mc-text)">{auth.user?.email || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-muted)">Access</p>
            <p className="mt-2 text-sm text-(--mc-text)">
              {auth.role === 'admin' ? 'Admin' : auth.loggedInAsSeller ? 'Seller' : 'Buyer'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-2xl text-(--mc-text)">Your listings</h2>
          <button
            type="button"
            onClick={loadProperties}
            className="rounded-full border border-(--mc-border) bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-text)"
          >
            Refresh
          </button>
        </div>
        {loading ? (
          <LoadingSpinner label="Loading listings" />
        ) : myListings.length ? (
          <div className="grid gap-8 md:grid-cols-3">
            {myListings.map((property) => (
              <div key={property.id} className="space-y-3">
                <PropertyCard property={property} />
                <Link
                  to={`/dashboard/user/properties/${property.id}/edit`}
                  className="inline-flex rounded-full border border-(--mc-border) bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-text) transition hover:border-(--mc-primary) hover:text-(--mc-primary)"
                >
                  Edit listing
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No listings yet"
            description="Create your first listing to showcase your property."
            action={
              auth.loggedInAsSeller || auth.role === 'admin' ? (
                <Link
                  to="/dashboard/user/properties/new"
                  className="rounded-full border border-[#D4A017] px-5 py-2 text-xs uppercase tracking-[0.3em] text-[#D4A017] transition hover:bg-[#D4A017] hover:text-[#0B1326]"
                >
                  Create listing
                </Link>
              ) : null
            }
          />
        )}
      </div>

      {(auth.loggedInAsSeller || auth.role === 'admin') ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-(--mc-text)">Incoming inquiries</h2>
            <button
              type="button"
              onClick={() => {
                loadProperties();
              }}
              className="rounded-full border border-(--mc-border) bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-text)"
            >
              Refresh listings
            </button>
          </div>

          {inquiriesError ? <InlineAlert variant="error" message={inquiriesError} /> : null}

          {inquiriesLoading ? (
            <LoadingSpinner label="Loading inquiries" />
          ) : incomingInquiries.length ? (
            <div className="space-y-4">
              {incomingInquiries.map((inquiry) => {
                const form = inquiryForms[inquiry.id] || {};
                return (
                  <div key={inquiry.id} className="rounded-4xl border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-display text-xl text-(--mc-text)">{inquiry.property?.city || 'Property'}</h3>
                          <Badge label={inquiry.status} />
                        </div>
                        <p className="text-sm text-(--mc-muted)">Buyer: {inquiry.tenant?.name || 'Unknown buyer'}</p>
                        <p className="text-sm text-(--mc-muted)">Requested visit: {inquiry.requestedVisitDate || 'N/A'} {inquiry.requestedVisitTime || ''}</p>
                        <p className="text-sm text-(--mc-muted)">Submitted: {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : 'Unknown'}</p>
                      </div>
                      <div className="text-sm text-(--mc-muted)">
                        <p>Property ID</p>
                        <p className="break-all text-(--mc-text)">{inquiry.propertyId}</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <input
                        type="date"
                        value={form.scheduledVisitDate || ''}
                        onChange={(e) => handleInquiryFieldChange(inquiry.id, 'scheduledVisitDate', e.target.value)}
                        className="rounded-2xl border border-(--mc-border) bg-white/80 px-3 py-2 text-sm"
                      />
                      <input
                        type="time"
                        value={form.scheduledVisitTime || ''}
                        onChange={(e) => handleInquiryFieldChange(inquiry.id, 'scheduledVisitTime', e.target.value)}
                        className="rounded-2xl border border-(--mc-border) bg-white/80 px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleRespondInquiry(inquiry.propertyId, inquiry.id)}
                        disabled={inquiry.status === 'closed'}
                        className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] transition ${inquiry.status === 'closed' ? 'bg-(--mc-muted)/30 text-(--mc-text)/60 cursor-not-allowed' : 'bg-(--mc-primary) text-white hover:bg-(--mc-primary-strong)'}`}
                      >
                        Respond
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCloseInquiry(inquiry.propertyId, inquiry.id)}
                        disabled={inquiry.status !== 'scheduled_visit'}
                        className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] transition ${inquiry.status !== 'scheduled_visit' ? 'border border-(--mc-border) bg-(--mc-muted)/10 text-(--mc-text)/60 cursor-not-allowed' : 'border border-(--mc-border) bg-white/70 text-(--mc-text) hover:border-(--mc-primary) hover:text-(--mc-primary)'}`}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title="No inquiries yet" description="Buyer inquiries for your listings will appear here." />
          )}
        </div>
      ) : null}

      {isBuyer ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-(--mc-text)">Saved favorites</h2>
            <button
              type="button"
              onClick={refreshFavorites}
              className="rounded-full border border-(--mc-border) bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-text)"
            >
              Refresh
            </button>
          </div>
          {favoriteProperties.length ? (
            <div className="grid gap-8 md:grid-cols-3">
              {favoriteProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No favorites saved"
              description="Save listings from the property details page to see them here."
              action={
                <Link
                  to="/properties"
                  className="rounded-full border border-[#D4A017] px-5 py-2 text-xs uppercase tracking-[0.3em] text-[#D4A017] transition hover:bg-[#D4A017] hover:text-[#0B1326]"
                >
                  Browse properties
                </Link>
              }
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default UserDashboard;
