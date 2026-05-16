import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PropertyCard from '../components/PropertyCard.jsx';
import PropertyBanner from '../components/PropertyBanner.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import InputField from '../components/InputField.jsx';
import SelectField from '../components/SelectField.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { listProperties } from '../services/propertyService.js';
import { getFavorites } from '../utils/favorites.js';

const Properties = () => {
  const auth = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: '',
    furnishingStatus: '',
  });
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(() => getFavorites());

  const fetchProperties = async (query = {}) => {
    setLoading(true);
    try {
      const data = await listProperties(query);
      setProperties(data.properties || []);
    } catch (error) {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setFavoriteIds(getFavorites());
    }
  }, [auth.isAuthenticated]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== '' && value !== null)
    );
    fetchProperties(query);
  };

  const handleClearFilters = () => {
    const reset = {
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      propertyType: '',
      furnishingStatus: '',
    };
    setFilters(reset);
    fetchProperties();
  };

  const isBuyer = auth.isAuthenticated && auth.role !== 'admin' && !auth.loggedInAsSeller;
  const favoriteProperties = useMemo(
    () => properties.filter((property) => favoriteIds.includes(property.id)),
    [properties, favoriteIds]
  );
  const nonFavoriteProperties = useMemo(
    () => properties.filter((property) => !favoriteIds.includes(property.id)),
    [properties, favoriteIds]
  );
  const bannerProperty = nonFavoriteProperties[0];
  const remainingProperties = nonFavoriteProperties.slice(1);

  return (
    <div className="pt-16 md:pt-0 px-6 py-10 md:py-16">
      <section className="mx-auto w-full max-w-7xl">
        <SectionHeading
          eyebrow="Portfolio"
          title="Explore refined residences and architectural statements."
          subtitle="Filter by location, price, or property profile to find the right investment."
        />
        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-4 rounded-[2rem] border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl md:grid-cols-3"
        >
          <InputField
            label="City"
            name="city"
            placeholder="Dubai"
            value={filters.city}
            onChange={handleChange}
          />
          <SelectField label="Property Type" name="propertyType" value={filters.propertyType} onChange={handleChange}>
            <option value="">All Types</option>
            <option value="flat">Flat</option>
            <option value="house">House</option>
            <option value="plot">Plot</option>
          </SelectField>
          <SelectField
            label="Furnishing"
            name="furnishingStatus"
            value={filters.furnishingStatus}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="furnished">Furnished</option>
            <option value="semi_furnished">Semi Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </SelectField>
          <InputField
            label="Min Price"
            name="minPrice"
            type="number"
            placeholder="250000"
            value={filters.minPrice}
            onChange={handleChange}
          />
          <InputField
            label="Max Price"
            name="maxPrice"
            type="number"
            placeholder="1500000"
            value={filters.maxPrice}
            onChange={handleChange}
          />
          <InputField
            label="Bedrooms"
            name="bedrooms"
            type="number"
            placeholder="3"
            value={filters.bedrooms}
            onChange={handleChange}
          />
          <div className="flex items-end md:col-span-3">
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-full bg-(--mc-primary) px-3 py-2 sm:px-6 sm:py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-(--mc-primary-strong)"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="rounded-full border border-(--mc-border) bg-white/70 px-3 py-2 sm:px-6 sm:py-3 text-xs font-semibold uppercase tracking-[0.32em] text-(--mc-text) transition hover:border-(--mc-primary) hover:text-(--mc-primary)"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="mt-8 mx-auto w-full max-w-7xl pb-20">
        {loading ? (
          <LoadingSpinner label="Loading properties" />
        ) : properties.length ? (
          <div className="space-y-12">
            {isBuyer && favoriteProperties.length ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-display text-2xl text-(--mc-text)">Your favorites</h2>
                  <span className="text-xs font-semibold uppercase tracking-[0.32em] text-(--mc-muted)">
                    {favoriteProperties.length} saved
                  </span>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                  {favoriteProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            ) : null}
            {bannerProperty ? <PropertyBanner property={bannerProperty} /> : null}
            <div className="grid gap-8 md:grid-cols-3">
              {remainingProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No properties found"
            description="Adjust your filters or explore the full portfolio."
          />
        )}
      </section>
    </div>
  );
};

export default Properties;
