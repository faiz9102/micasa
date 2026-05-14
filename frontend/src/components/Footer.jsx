const Footer = () => (
  <footer className="border-t border-white/10 bg-[#0B1326]">
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 md:grid-cols-3">
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-[#D4A017]">micasa</p>
        <p className="mt-4 text-sm text-slate-300/80">
          Premium real estate experiences crafted with architectural calm and modern luxury.
        </p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Contact</p>
        <p className="mt-3 text-sm text-slate-300">hello@micasa.com</p>
        <p className="text-sm text-slate-300">+92 348-9285680</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Locations</p>
        <p className="mt-3 text-sm text-slate-300">Rawalpindi · Islamabad · Chakri</p>
        <p className="text-sm text-slate-300">Private viewings by appointment</p>
      </div>
    </div>
    <div className="border-t border-white/10 py-4 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
      Crafted with precision · 2026
    </div>
  </footer>
);

export default Footer;
