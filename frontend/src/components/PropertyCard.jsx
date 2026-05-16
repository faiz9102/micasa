import { Link } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { formatCurrency } from '../utils/format.js';
import { propertyTypeLabels, purposeLabels } from '../utils/property.js';

const PropertyCard = ({ property }) => {
  const images = property?.imageUrls || [];
  const cover = images[0];
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (images.length <= 1) return undefined;

    const start = () => {
      intervalRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % images.length);
      }, 3000);
    };

    start();
    return () => clearInterval(intervalRef.current);
  }, [images.length]);
  const propertyId = property?.id ?? property?.propertyId;

  const content = (
    <>
      <div
        className="relative h-44 md:h-56 w-full overflow-hidden bg-(--mc-bg-alt)"
        onMouseEnter={() => clearInterval(intervalRef.current)}
        onMouseLeave={() => {
          if (images.length <= 1) return;
          intervalRef.current = setInterval(() => setIndex((i) => (i + 1) % images.length), 3000);
        }}
      >
        {images.length ? (
          images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${property.city} ${i + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                i === index ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transform: i === index ? 'scale(1.02)' : 'scale(1)' }}
            />
          ))
        ) : (
          <div className="flex h-full items-center justify-center bg-(--mc-bg-alt) text-xs font-semibold uppercase tracking-[0.3em] text-(--mc-muted)">
            No Image
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute left-1/2 bottom-2 flex -translate-x-1/2 gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                className={`h-2 w-8 rounded-full transition-all ${i === index ? 'bg-[var(--mc-primary)] w-8' : 'bg-[var(--mc-border)] w-4'}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="space-y-2 p-6">
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-primary)">
          <span>{purposeLabels[property.purpose]}</span>
          <span>{propertyTypeLabels[property.propertyType]}</span>
        </div>
        <h3 className="font-display text-xl text-(--mc-text)">
          {property.city} · {formatCurrency(property.price)}
        </h3>
        <p className="line-clamp-2 text-sm text-(--mc-muted)">{property.description}</p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">View details</p>
      </div>
    </>
  );

  if (!propertyId) {
    return (
      <div className="group block overflow-hidden rounded-[2rem] border border-(--mc-border) bg-(--mc-surface) shadow-sm backdrop-blur-xl">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={`/properties/${propertyId}`}
      className="group block overflow-hidden rounded-[2rem] border border-(--mc-border) bg-(--mc-surface) shadow-sm transition duration-300 hover:-translate-y-1 hover:border-(--mc-primary)/40 hover:shadow-(--mc-shadow) backdrop-blur-xl"
    >
      {content}
    </Link>
  );
};

export default PropertyCard;
