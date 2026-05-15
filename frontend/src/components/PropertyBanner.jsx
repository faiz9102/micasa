import { Link } from 'react-router';
import { formatCurrency } from '../utils/format.js';
import { propertyTypeLabels, purposeLabels } from '../utils/property.js';

const PropertyBanner = ({ property }) => {
  const cover = property?.imageUrls?.[0];
  const propertyId = property?.id ?? property?.propertyId;

  if (!propertyId) {
    return null;
  }

  return (
    <Link
      to={`/properties/${propertyId}`}
      className="group grid overflow-hidden rounded-4xl border-(--mc-border) bg-(--mc-surface) shadow-sm transition duration-300 hover:-translate-y-1 hover:border-(--mc-primary)/40 hover:shadow-(--mc-shadow) md:grid-cols-[1.2fr_1fr] backdrop-blur-xl"
    >
      <div className="h-64 overflow-hidden bg-(--mc-bg-alt) md:h-full">
        {cover ? (
          <img src={cover} alt={property.city} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.34em] text-(--mc-muted)">
            No Image
          </div>
        )}
      </div>
      <div className="space-y-4 p-8">
        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-primary)">
          <span>{purposeLabels[property.purpose]}</span>
          <span className="text-(--mc-muted)">•</span>
          <span>{propertyTypeLabels[property.propertyType]}</span>
        </div>
        <h3 className="font-display text-2xl text-(--mc-text)">{property.city}</h3>
        <p className="line-clamp-3 text-sm text-(--mc-muted)">{property.description}</p>
        <div className="text-lg font-semibold text-(--mc-text)">{formatCurrency(property.price)}</div>
      </div>
    </Link>
  );
};

export default PropertyBanner;
