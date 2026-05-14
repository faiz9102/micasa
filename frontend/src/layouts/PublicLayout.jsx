import { Outlet } from 'react-router';
import CornerNav from '../components/CornerNav.jsx';
import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';

const PublicLayout = () => (
  <div className="min-h-screen bg-[#0B1326] text-white">
    <NavBar />
    <main className="min-h-[70vh]">
      <div className="mx-auto flex w-full max-w-7xl justify-end px-6 pt-4">
        <CornerNav />
      </div>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
