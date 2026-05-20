import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Badge from '../components/Badge.jsx';
import InlineAlert from '../components/InlineAlert.jsx';
import InputField from '../components/InputField.jsx';
import { getProperty } from '../services/propertyService.js';
import { createInquiry } from '../services/inquiryService.js';
import { formatCurrency, formatNumber } from '../utils/format.js';
import { isFavorite, toggleFavorite } from '../utils/favorites.js';
import {
  furnishingLabels,
  propertyTypeLabels,
  purposeLabels,
  rentalScopeLabels,
} from '../utils/property.js';

const PropertyDetails = () => {
  const { id } = useParams();
  const auth = useSelector((state) => state.auth);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favoriteVersion, setFavoriteVersion] = useState(0);
  const [inquiryForm, setInquiryForm] = useState({
    requestedVisitDate: '',
    requestedVisitTime: '',
  });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getProperty(id);
        if (!data?.property) {
          throw new Error('Property not found');
        }
        setProperty(data.property);
      } catch (error) {
        void error;
        setError('Unable to load property. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleFavorite = () => {
    toggleFavorite(id);
    setFavoriteVersion((prev) => prev + 1);
  };

  const handleInquiryChange = (event) => {
    const { name, value } = event.target;
    setInquiryForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatInquiryError = (err, fallback) => {
    const apiErrors = err?.response?.data?.errors;
    if (Array.isArray(apiErrors) && apiErrors.length) {
      return apiErrors.map((issue) => `${issue.field}: ${issue.message}`).join(' • ');
    }

    return err?.response?.data?.message || fallback;
  };

  const handleInquirySubmit = async (event) => {
    event.preventDefault();
    setInquiryError('');
    setInquirySuccess('');
    setInquiryStatus('');

    const isBuyer = auth.isAuthenticated && auth.role !== 'admin' && !auth.loggedInAsSeller;
    if (!isBuyer) {
      setInquiryError('Please sign in as a buyer to submit an inquiry.');
      return;
    }

    setInquiryLoading(true);
    try {
      const data = await createInquiry(id, inquiryForm);
      const status = data?.inquiry?.status || 'new';
      const statusLabel =
        status === 'new'
          ? 'New'
          : status === 'contacted'
          ? 'Contacted'
          : status === 'scheduled_visit'
          ? 'Scheduled Visit'
          : status === 'closed'
          ? 'Closed'
          : status;
      setInquiryStatus(statusLabel);
      setInquirySuccess(`Inquiry submitted. Status: ${statusLabel}.`);
      setInquiryForm({ requestedVisitDate: '', requestedVisitTime: '' });
    } catch (err) {
      if (err?.response?.status === 409) {
        setInquiryError('An inquiry already exists for this property.');
      } else {
        setInquiryError(formatInquiryError(err, 'Unable to submit inquiry.'));
      }
    } finally {
      setInquiryLoading(false);
    }
  };

  const favorite = useMemo(() => {
    void favoriteVersion;
    return isFavorite(id);
  }, [id, favoriteVersion]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <LoadingSpinner label="Loading property" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <InlineAlert variant="error" message={error} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <InlineAlert variant="error" message="Property not found." />
        <Link
          to="/properties"
          className="mt-6 inline-flex rounded-full border border-(--mc-primary) px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-(--mc-primary) transition hover:bg-(--mc-primary) hover:text-white"
        >
          Back to properties
        </Link>
      </div>
    );
  }

  const owner = property.owner;
  const contactEmail = owner?.email;
  const contactHref = contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent(`Interested in ${property.city}`)}`
    : '/login/buyer';
  const contactLabel = contactEmail ? 'Contact seller' : 'Login to contact';
  const isBuyer = auth.isAuthenticated && auth.role !== 'admin' && !auth.loggedInAsSeller;

  return (
    <div className="pt-16 md:pt-0 px-6 py-10 md:py-16">
      <section className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">Property</p>
            <h1 className="mt-4 font-display text-4xl text-(--mc-text)">{property.city}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-(--mc-muted)">{property.description}</p>
          </div>
          <div className="rounded-[1.75rem] border border-(--mc-border) bg-(--mc-surface) px-6 py-4 text-right shadow-sm backdrop-blur-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-muted)">Listing Price</p>
            <p className="mt-2 font-display text-3xl text-(--mc-text)">{formatCurrency(property.price)}</p>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">Image Gallery</p>
          <div className="grid gap-6 md:grid-cols-3">
            {(property.imageUrls || []).map((url, index) => (
              <div key={url} className="overflow-hidden rounded-[1.75rem] border border-(--mc-border) bg-(--mc-surface) shadow-sm backdrop-blur-xl">
                <img
                    src={url}
                    alt={`${property.city} ${index + 1}`}
                    className="h-44 md:h-60 w-full object-cover"
                  />
              </div>
            ))}
            {!property.imageUrls?.length && (
              <div className="rounded-[1.75rem] border border-dashed border-(--mc-border) p-10 text-sm text-(--mc-muted) shadow-sm backdrop-blur-xl">
                No images available.
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">Property Overview</p>
              <p className="mt-2 text-sm text-(--mc-muted)">{property.description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge label={purposeLabels[property.purpose]} />
              <Badge label={propertyTypeLabels[property.propertyType]} />
              {property.furnishingStatus ? <Badge label={furnishingLabels[property.furnishingStatus]} /> : null}
              {property.rentalScope ? <Badge label={rentalScopeLabels[property.rentalScope]} /> : null}
            </div>
            <div className="rounded-[1.75rem] border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">Amenities</p>
              <ul className="mt-4 space-y-2 text-sm text-(--mc-text)">
                {property.amenities?.length
                  ? property.amenities.map((amenity) => (
                      <li key={amenity}>• {amenity}</li>
                    ))
                  : 'No amenities listed.'}
              </ul>
            </div>
            <div className="grid gap-4 rounded-[1.75rem] border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl md:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-muted)">Area</p>
                <p className="mt-2 text-lg text-(--mc-text)">{formatNumber(property.area)} sq ft</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-muted)">Bedrooms</p>
                <p className="mt-2 text-lg text-(--mc-text)">{property.bedrooms ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-muted)">Floor</p>
                <p className="mt-2 text-lg text-(--mc-text)">{property.floorNumber ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-muted)">Listing ID</p>
                <p className="mt-2 break-all text-sm text-(--mc-text)">{property.id}</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">Contact / Inquiry</p>
              <div className="mt-4 space-y-2 text-sm text-(--mc-text)">
                <p>{owner?.name || 'Verified seller'}</p>
                <p className="text-(--mc-muted)">{contactEmail || 'Login to view contact details.'}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleFavorite}
                  className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] transition ${
                    favorite
                      ? 'border-(--mc-primary) bg-(--mc-primary) text-white'
                      : 'border-(--mc-border) bg-white/70 text-(--mc-text) hover:border-(--mc-primary) hover:text-(--mc-primary)'
                  }`}
                >
                  {favorite ? 'Saved' : 'Add to favorites'}
                </button>
                {contactEmail ? (
                  <a
                    href={contactHref}
                    className="rounded-full border border-(--mc-primary) px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-(--mc-primary) transition hover:bg-(--mc-primary) hover:text-white"
                  >
                    {contactLabel}
                  </a>
                ) : (
                  <Link
                    to={contactHref}
                    className="rounded-full border border-(--mc-primary) px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-(--mc-primary) transition hover:bg-(--mc-primary) hover:text-white"
                  >
                    {contactLabel}
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">Inquiry</p>
              <p className="mt-2 text-sm text-(--mc-muted)">
                Request a visit. Statuses include New, Contacted, Scheduled Visit, Closed.
              </p>
              {!isBuyer ? (
                <div className="mt-4 space-y-3">
                  <InlineAlert variant="info" message="Sign in as a buyer to submit an inquiry." />
                  <Link
                    to="/login/buyer"
                    className="inline-flex rounded-full border border-(--mc-border) bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-text) transition hover:border-(--mc-primary) hover:text-(--mc-primary)"
                  >
                    Login as buyer
                  </Link>
                </div>
              ) : (
                <form className="mt-4 space-y-4" onSubmit={handleInquirySubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <InputField
                      label="Visit date"
                      name="requestedVisitDate"
                      type="date"
                      value={inquiryForm.requestedVisitDate}
                      onChange={handleInquiryChange}
                      required
                    />
                    <InputField
                      label="Visit time"
                      name="requestedVisitTime"
                      type="time"
                      value={inquiryForm.requestedVisitTime}
                      onChange={handleInquiryChange}
                      required
                    />
                  </div>
                  {inquiryError ? <InlineAlert variant="error" message={inquiryError} /> : null}
                  {inquirySuccess ? <InlineAlert variant="success" message={inquirySuccess} /> : null}
                  {inquiryStatus && !inquirySuccess ? (
                    <InlineAlert variant="info" message={`Current status: ${inquiryStatus}`} />
                  ) : null}
                  <button
                    type="submit"
                    disabled={inquiryLoading}
                    className="w-full rounded-full bg-(--mc-primary) px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-(--mc-primary-strong) disabled:opacity-70"
                  >
                    {inquiryLoading ? 'Submitting...' : 'Submit inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetails;
