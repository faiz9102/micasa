import { Link } from 'react-router';
import { formatCurrency } from '../utils/format.js';
import { propertyTypeLabels, purposeLabels } from '../utils/property.js';

const PropertyCard = ({ property }) => {
  const cover = property?.imageUrls?.[0];
  const propertyId = property?.id ?? property?.propertyId;

  const content = (
    <>
      <div className="relative h-56 w-full overflow-hidden bg-[var(--mc-bg-alt)]">
        {cover ? (
          <img
            src={cover}
            alt={property.city}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[var(--mc-bg-alt)] text-xs font-semibold uppercase tracking-[0.3em] text-[var(--mc-muted)]">
            No Image
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className="space-y-2 p-6">
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--mc-primary)]">
          <span>{purposeLabels[property.purpose]}</span>
          <span>{propertyTypeLabels[property.propertyType]}</span>
        </div>
        <h3 className="font-display text-xl text-[var(--mc-text)]">
          {property.city} · {formatCurrency(property.price)}
        </h3>
        <p className="line-clamp-2 text-sm text-[var(--mc-muted)]">{property.description}</p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--mc-accent)]">View details</p>
      </div>
    </>
  );

  if (!propertyId) {
    return (
      <div className="group block overflow-hidden rounded-[2rem] border border-[var(--mc-border)] bg-[var(--mc-surface)] shadow-sm backdrop-blur-xl">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={`/properties/${propertyId}`}
      className="group block overflow-hidden rounded-[2rem] border border-[var(--mc-border)] bg-[var(--mc-surface)] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--mc-primary)]/40 hover:shadow-[var(--mc-shadow)] backdrop-blur-xl"
    >
      {content}
    </Link>
  );
};

export default PropertyCard;
