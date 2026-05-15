import { Outlet } from 'react-router';
import CornerNav from '../components/CornerNav.jsx';
import DashboardSidebar from '../components/DashboardSidebar.jsx';

const DashboardLayout = ({ title, items }) => (
  <div className="relative min-h-screen overflow-hidden text-[var(--mc-text)] md:grid md:grid-cols-[280px_1fr]">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(199,109,68,0.1),transparent_24%)]" />
    <DashboardSidebar title={title} items={items} />
    <main className="relative px-6 py-10 md:px-10 lg:px-12">
      <div className="flex justify-end pb-6">
        <CornerNav />
      </div>
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
