import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Badge from '../components/Badge.jsx';
import InlineAlert from '../components/InlineAlert.jsx';
import { getProperty } from '../services/propertyService.js';
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
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorite, setFavorite] = useState(false);

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
      } catch (err) {
        setError('Unable to load property. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  useEffect(() => {
    setFavorite(isFavorite(id));
  }, [id]);

  const handleFavorite = () => {
    setFavorite(toggleFavorite(id));
  };

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
          className="mt-6 inline-flex rounded-full border border-[#D4A017] px-5 py-2 text-xs uppercase tracking-[0.3em] text-[#D4A017] transition hover:bg-[#D4A017] hover:text-[#0B1326]"
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

  return (
    <div className="bg-[#0B1326]">
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#D4A017]">Property</p>
            <h1 className="mt-4 font-display text-4xl text-white">{property.city}</h1>
            <p className="mt-3 text-sm text-slate-300/80">{property.description}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-right">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Listing Price</p>
            <p className="mt-2 font-display text-3xl text-white">{formatCurrency(property.price)}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {(property.imageUrls || []).map((url, index) => (
            <div key={url} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <img
                src={url}
                alt={`${property.city} ${index + 1}`}
                className="h-60 w-full object-cover"
              />
            </div>
          ))}
          {!property.imageUrls?.length && (
            <div className="rounded-3xl border border-dashed border-white/10 p-10 text-sm text-slate-400">
              No images available.
            </div>
          )}
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Badge label={purposeLabels[property.purpose]} />
              <Badge label={propertyTypeLabels[property.propertyType]} />
              {property.furnishingStatus ? <Badge label={furnishingLabels[property.furnishingStatus]} /> : null}
              {property.rentalScope ? <Badge label={rentalScopeLabels[property.rentalScope]} /> : null}
            </div>
            <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Area</p>
                <p className="mt-2 text-lg text-white">{formatNumber(property.area)} sq ft</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Bedrooms</p>
                <p className="mt-2 text-lg text-white">{property.bedrooms ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Floor</p>
                <p className="mt-2 text-lg text-white">{property.floorNumber ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Listing ID</p>
                <p className="mt-2 text-sm text-white break-all">{property.id}</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#D4A017]">Amenities</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {property.amenities?.length
                  ? property.amenities.map((amenity) => (
                      <li key={amenity}>• {amenity}</li>
                    ))
                  : 'No amenities listed.'}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#D4A017]">Seller</p>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p className="text-white">{owner?.name || 'Verified seller'}</p>
                <p className="text-slate-400">{contactEmail || 'Login to view contact details.'}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleFavorite}
                  className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.3em] transition ${
                    favorite
                      ? 'border-[#D4A017] bg-[#D4A017] text-[#0B1326]'
                      : 'border-white/20 text-white/80 hover:border-[#D4A017] hover:text-white'
                  }`}
                >
                  {favorite ? 'Saved' : 'Add to favorites'}
                </button>
                {contactEmail ? (
                  <a
                    href={contactHref}
                    className="rounded-full border border-[#D4A017] px-5 py-2 text-xs uppercase tracking-[0.3em] text-[#D4A017] transition hover:bg-[#D4A017] hover:text-[#0B1326]"
                  >
                    {contactLabel}
                  </a>
                ) : (
                  <Link
                    to={contactHref}
                    className="rounded-full border border-[#D4A017] px-5 py-2 text-xs uppercase tracking-[0.3em] text-[#D4A017] transition hover:bg-[#D4A017] hover:text-[#0B1326]"
                  >
                    {contactLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetails;
