import { Outlet } from 'react-router';
import CornerNav from '../components/CornerNav.jsx';
import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';

const PublicLayout = () => (
  <div className="relative min-h-screen overflow-hidden text-(--mc-text)">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(199,109,68,0.12),transparent_26%)]" />
    <NavBar />
    <main className="relative min-h-[70vh]">
      <div className="mx-auto flex w-full max-w-7xl justify-end px-6 pt-4">
        <CornerNav />
      </div>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
