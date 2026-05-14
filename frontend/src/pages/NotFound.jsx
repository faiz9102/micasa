import { Link } from 'react-router';

const NotFound = () => (
  <div className="flex min-h-[70vh] items-center justify-center bg-[#0B1326] px-6">
    <div className="max-w-xl text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-[#D4A017]">404</p>
      <h1 className="mt-4 font-display text-4xl text-white">Page not found</h1>
      <p className="mt-3 text-sm text-slate-300/80">
        The page you are looking for has moved or is no longer available.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-full bg-[#D4A017] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[#0B1326] transition hover:bg-[#e9c35e]"
      >
        Return home
      </Link>
    </div>
  </div>
);

export default NotFound;
