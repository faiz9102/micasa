import { useState } from 'react';
import { Outlet } from 'react-router';
import CornerNav from '../components/CornerNav.jsx';
import DashboardSidebar from '../components/DashboardSidebar.jsx';

const DashboardLayout = ({ title, items }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden text-(--mc-text) md:grid md:grid-cols-[280px_1fr]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(199,109,68,0.1),transparent_24%)]" />

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar title={title} items={items} />
      </div>

      <main className="relative pt-16 md:pt-0 px-6 py-10 md:px-10 lg:px-12">
        <div className="flex items-center justify-between pb-6">
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-full border border-(--mc-border) bg-white/70 px-3 py-2 text-sm font-semibold"
            >
              Menu
            </button>
          </div>
          <div className="flex justify-end">
            <CornerNav />
          </div>
        </div>

        <Outlet />
      </main>

      {/* Mobile sidebar drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 bg-(--mc-surface) border-r border-(--mc-border) p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-(--mc-accent)">{title}</p>
                <p className="mt-1 font-display text-lg text-(--mc-text)">micasa</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="px-2 py-1">Close</button>
            </div>
            <div className="mt-6">
              <DashboardSidebar title={title} items={items} />
            </div>
          </div>
          <div className="flex-1" onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
