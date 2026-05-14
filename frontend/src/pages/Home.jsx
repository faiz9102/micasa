import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import SectionHeading from '../components/SectionHeading.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { listProperties } from '../services/propertyService.js';
import heroImage from '../assets/hero.png';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div className="bg-[#0B1326]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Modern residence" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-linear-to-r from-[#0B1326] via-[#0B1326]/90 to-transparent" />
        </div>
        <div className="relative mx-auto flex min-h-[80vh] w-full max-w-7xl flex-col justify-center px-6 py-16">
          <p className="text-xs uppercase tracking-[0.4em] text-[#D4A017]">micasa collection</p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl text-white md:text-6xl">
            Curated residences with architectural calm and a modern luxury signature.
          </h1>
          <p className="mt-6 max-w-2xl text-sm text-slate-300/80">
            Explore premium properties crafted for discerning lifestyles. We connect buyers, sellers, and investors
            with trusted guidance and elevated experiences.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/properties"
              className="rounded-full bg-[#D4A017] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[#0B1326] transition hover:bg-[#e9c35e]"
            >
              View Properties
            </Link>
            <Link
              to="/login/seller"
              className="rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white"
            >
              List With Us
            </Link>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              { label: 'Global Buyers', value: '3.2K+' },
              { label: 'Luxury Listings', value: '480+' },
              { label: 'Avg. Days to Close', value: '18' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                <p className="mt-4 font-display text-3xl text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20">
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
                <div className="rounded-3xl border border-dashed border-white/10 p-10 text-sm text-slate-400">
                  Featured listings will appear once properties are added.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0F172A]">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-20 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
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
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-300/80">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4A017]">Services</p>
            <h3 className="mt-4 font-display text-2xl text-white">Concierge-level support.</h3>
            <p className="mt-4 text-sm text-slate-300/80">
              From listing strategy to legal documentation, our team ensures every step feels seamless and secure.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li>• Seller valuation reports</li>
              <li>• Investor portfolio planning</li>
              <li>• End-to-end closing assistance</li>
              <li>• Private client events</li>
            </ul>
            <Link
              to="/register"
              className="mt-8 inline-flex rounded-full border border-[#D4A017] px-5 py-2 text-xs uppercase tracking-[0.3em] text-[#D4A017] transition hover:bg-[#D4A017] hover:text-[#0B1326]"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
