import { Link } from 'react-router';
import { formatCurrency } from '../utils/format.js';
import { propertyTypeLabels, purposeLabels } from '../utils/property.js';

const PropertyCard = ({ property }) => {
  const cover = property?.imageUrls?.[0];
  const propertyId = property?.id ?? property?.propertyId;

  const content = (
    <>
      <div className="h-56 w-full overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={property.city}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-400">
            No Image
          </div>
        )}
      </div>
      <div className="space-y-2 p-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#D4A017]">
          <span>{purposeLabels[property.purpose]}</span>
          <span>{propertyTypeLabels[property.propertyType]}</span>
        </div>
        <h3 className="font-display text-xl text-white">
          {property.city} · {formatCurrency(property.price)}
        </h3>
        <p className="text-sm text-slate-300/80 line-clamp-2">{property.description}</p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">View details</p>
      </div>
    </>
  );

  if (!propertyId) {
    return (
      <div className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={`/properties/${propertyId}`}
      className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:border-[#D4A017]/60"
    >
      {content}
    </Link>
  );
};

export default PropertyCard;
