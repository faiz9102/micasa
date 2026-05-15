import { Link } from 'react-router';

const NotFound = () => (
  <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
    <div className="max-w-xl rounded-4xl border-(--mc-border) bg-(--mc-surface) p-8 text-center shadow-(--mc-shadow) backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-(--mc-accent)">404</p>
      <h1 className="mt-4 font-display text-4xl text-(--mc-text)">Page not found</h1>
      <p className="mt-3 text-sm text-(--mc-muted)">
        The page you are looking for has moved or is no longer available.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-full bg-(--mc-primary) px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-(--mc-primary-strong)"
      >
        Return home
      </Link>
    </div>
  </div>
);

export default NotFound;
