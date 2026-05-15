const Footer = () => (
  <footer className="border-t border-[var(--mc-border)] bg-[var(--mc-surface)] backdrop-blur-xl">
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 md:grid-cols-3">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[var(--mc-accent)]">micasa</p>
        <p className="mt-4 text-sm text-[var(--mc-muted)]">
          Premium real estate experiences crafted with clarity, discretion, and modern balance.
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--mc-muted)]">Contact</p>
        <p className="mt-3 text-sm text-[var(--mc-text)]">hello@micasa.com</p>
        <p className="text-sm text-[var(--mc-text)]">+92 348-9285680</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--mc-muted)]">Locations</p>
        <p className="mt-3 text-sm text-[var(--mc-text)]">Rawalpindi · Islamabad · Chakri</p>
        <p className="text-sm text-[var(--mc-text)]">Private viewings by appointment</p>
      </div>
    </div>
    <div className="border-t border-[var(--mc-border)] py-4 text-center text-xs uppercase tracking-[0.3em] text-[var(--mc-muted)]">
      Crafted with precision · 2026
    </div>
  </footer>
);

export default Footer;
