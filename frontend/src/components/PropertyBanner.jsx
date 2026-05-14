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
      className="group grid overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:border-[#D4A017]/60 md:grid-cols-[1.2fr_1fr]"
    >
      <div className="h-64 md:h-full">
        {cover ? (
          <img src={cover} alt={property.city} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-400">
            No Image
          </div>
        )}
      </div>
      <div className="space-y-4 p-8">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#D4A017]">
          <span>{purposeLabels[property.purpose]}</span>
          <span className="text-white/40">•</span>
          <span>{propertyTypeLabels[property.propertyType]}</span>
        </div>
        <h3 className="font-display text-2xl text-white">{property.city}</h3>
        <p className="text-sm text-slate-300/80 line-clamp-3">{property.description}</p>
        <div className="text-lg font-semibold text-white">{formatCurrency(property.price)}</div>
      </div>
    </Link>
  );
};

export default PropertyBanner;
