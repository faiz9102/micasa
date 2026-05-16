import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import SectionHeading from '../components/SectionHeading.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { listProperties } from '../services/propertyService.js';
import heroImage from '../assets/hero.png';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await listProperties();
        setFeatured((data.properties || []).slice(0, 3));
      } catch (error) {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="pt-16 md:pt-0">
      <section 
        className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-black/40" />
        
        {/* Content */}
        <div className="relative z-10 w-full px-6 md:px-12">
          <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div className="space-y-8 py-12 md:py-20">
              <div className="inline-flex rounded-full border border-(--mc-border) bg-(--mc-surface) px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent) shadow-sm backdrop-blur-xl w-fit">
                Curated living
              </div>
              <div className="space-y-6">
                <h1 className="max-w-3xl font-display text-5xl md:text-6xl lg:text-7xl text-(--mc-text) leading-tight">
                  Find homes with calm architecture and a sharper, modern edge.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-(--mc-muted)">
                  Explore premium properties crafted for discerning lifestyles. We connect buyers, sellers, and investors
                  with trusted guidance and a more considered presentation.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/properties"
                  className="rounded-full bg-(--mc-primary) px-4 py-2 sm:px-6 sm:py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-(--mc-primary-strong)"
                >
                  View Properties
                </Link>
                <Link
                  to="/login/seller"
                  className="rounded-full border border-(--mc-border) bg-white/70 px-4 py-2 sm:px-6 sm:py-3 text-xs font-semibold uppercase tracking-[0.32em] text-(--mc-text) transition hover:border-(--mc-primary) hover:text-(--mc-primary)"
                >
                  List With Us
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Global Buyers', value: '3.2K+' },
                  { label: 'Luxury Listings', value: '480+' },
                  { label: 'Avg. Days to Close', value: '18' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[1.75rem] border border-(--mc-border) bg-(--mc-surface) p-5 shadow-sm backdrop-blur-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-(--mc-muted)">{stat.label}</p>
                    <p className="mt-4 font-display text-3xl text-(--mc-text)">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side info cards - hidden on mobile */}
            <div className="hidden lg:flex flex-col gap-4 py-20">
              <div className="rounded-[1.5rem] border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-accent)">Signature service</p>
                <p className="mt-3 text-base text-(--mc-text)">Concierge presentation for every listing.</p>
              </div>
              <div className="rounded-[1.5rem] border border-(--mc-border) bg-(--mc-surface) p-6 shadow-sm backdrop-blur-xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-(--mc-accent)">Trusted network</p>
                <p className="mt-3 text-base text-(--mc-text)">Verified clients and secure transactions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured section */}
      <div className="bg-(--mc-bg) px-6 py-8 md:py-12">
        <div className="mx-auto w-full max-w-7xl">
          <SectionHeading
            eyebrow="Featured"
            title="Signature properties selected for elevated living."
            subtitle="Our portfolio balances timeless architecture with contemporary comfort, curated by trusted advisors."
          />
          <div className="mt-10">
            {loading ? (
              <LoadingSpinner label="Loading featured properties" />
            ) : (
              <div className="grid gap-8 md:grid-cols-3">
                {featured.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
                {!featured.length && (
                  <div className="rounded-[2rem] border border-dashed border-(--mc-border) bg-(--mc-surface) p-10 text-sm text-(--mc-muted) shadow-sm backdrop-blur-xl">
                    Featured listings will appear once properties are added.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="border-y border-(--mc-border) bg-(--mc-surface)/70 backdrop-blur-xl">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-0 py-20 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6 px-6">
            <SectionHeading
              eyebrow="Experience"
              title="A calm, confident process from listing to closing."
              subtitle="We prioritize discretion, data-backed valuation, and thoughtful presentation for every property."
            />
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { title: 'Private Advisory', text: 'Personalized guidance for buyers and sellers.' },
                { title: 'Premium Marketing', text: 'Architectural visuals and global exposure.' },
                { title: 'Trusted Network', text: 'Verified clients and secure transactions.' },
                { title: 'Market Intelligence', text: 'Real-time insights for strategic decisions.' },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-(--mc-border) bg-(--mc-surface) p-5 shadow-sm backdrop-blur-xl">
                  <p className="text-sm font-semibold text-(--mc-text)">{item.title}</p>
                  <p className="mt-2 text-sm text-(--mc-muted)">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
            <div className="mx-6 rounded-[2rem] border border-(--mc-border) bg-(--mc-surface) p-8 shadow-sm backdrop-blur-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-(--mc-accent)">Services</p>
            <h3 className="mt-4 font-display text-2xl text-(--mc-text)">Concierge-level support.</h3>
            <p className="mt-4 text-sm leading-7 text-(--mc-muted)">
              From listing strategy to legal documentation, our team ensures every step feels seamless and secure.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-(--mc-text)">
              <li>• Seller valuation reports</li>
              <li>• Investor portfolio planning</li>
              <li>• End-to-end closing assistance</li>
              <li>• Private client events</li>
            </ul>
            { !auth.isAuthenticated && (
              <Link
                to="/register"
                className="mt-8 inline-flex rounded-full bg-(--mc-primary) px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-(--mc-primary-strong)"
              >
                Create account
              </Link>
            ) }
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
