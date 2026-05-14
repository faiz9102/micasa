import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import PageHeader from '../components/PageHeader.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { listProperties } from '../services/propertyService.js';
import { getFavorites } from '../utils/favorites.js';

const UserDashboard = () => {
  const auth = useSelector((state) => state.auth);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(() => getFavorites());

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
              className="rounded-full bg-[#D4A017] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[#0B1326] transition hover:bg-[#e9c35e]"
            >
              Create listing
            </Link>
          ) : null
        }
      />

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4A017]">Profile</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Name</p>
            <p className="mt-2 text-sm text-white">{auth.user?.name || '—'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</p>
            <p className="mt-2 text-sm text-white">{auth.user?.email || '—'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Access</p>
            <p className="mt-2 text-sm text-white">
              {auth.role === 'admin' ? 'Admin' : auth.loggedInAsSeller ? 'Seller' : 'Buyer'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-2xl text-white">Your listings</h2>
          <button
            type="button"
            onClick={loadProperties}
            className="rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-slate-300"
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
                  className="inline-flex rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-slate-300 transition hover:border-[#D4A017] hover:text-white"
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

      {isBuyer ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-white">Saved favorites</h2>
            <button
              type="button"
              onClick={refreshFavorites}
              className="rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-slate-300"
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
