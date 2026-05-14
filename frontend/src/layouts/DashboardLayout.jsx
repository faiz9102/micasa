import { Outlet } from 'react-router';
import CornerNav from '../components/CornerNav.jsx';
import DashboardSidebar from '../components/DashboardSidebar.jsx';

const DashboardLayout = ({ title, items }) => (
  <div className="min-h-screen bg-[#0B1326] text-white md:grid md:grid-cols-[260px_1fr]">
    <DashboardSidebar title={title} items={items} />
    <main className="px-6 py-10 md:px-10">
      <div className="flex justify-end pb-6">
        <CornerNav />
      </div>
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
