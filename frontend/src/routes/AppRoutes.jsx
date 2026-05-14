import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import PublicLayout from '../layouts/PublicLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Home from '../pages/Home.jsx';
import Properties from '../pages/Properties.jsx';
import PropertyDetails from '../pages/PropertyDetails.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import UserDashboard from '../pages/UserDashboard.jsx';
import CreateProperty from '../pages/CreateProperty.jsx';
import EditProperty from '../pages/EditProperty.jsx';
import NotFound from '../pages/NotFound.jsx';

const RequireAuth = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login/buyer" state={{ from: location }} replace />;
  }

  return children ?? <Outlet />;
};

const RequireAdmin = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login/admin" state={{ from: location }} replace />;
  }

  if (auth.role !== 'admin') {
    return <Navigate to={auth.loggedInAsSeller ? '/dashboard/user' : '/'} replace />;
  }

  return children ?? <Outlet />;
};

const RequireSeller = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login/seller" state={{ from: location }} replace />;
  }

  if (auth.role === 'admin' || auth.loggedInAsSeller) {
    return children ?? <Outlet />;
  }

  return <Navigate to="/" replace />;
};

const RedirectDashboard = () => {
  const auth = useSelector((state) => state.auth);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login/buyer" replace />;
  }

  if (auth.role === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (auth.loggedInAsSeller) {
    return <Navigate to="/dashboard/user" replace />;
  }

  return <Navigate to="/" replace />;
};

const AppRoutes = () => {
  const adminSidebar = [{ label: 'Overview', to: '/dashboard/admin', end: true }];
  const userSidebar = [
    { label: 'Overview', to: '/dashboard/user', end: true },
    { label: 'Create Listing', to: '/dashboard/user/properties/new' },
  ];

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/not-found" element={<NotFound />} />
      </Route>

      <Route path="/dashboard" element={<RequireAuth />}
      >
        <Route index element={<RedirectDashboard />} />
      </Route>

      <Route
        path="/dashboard/admin"
        element={
          <RequireAdmin>
            <DashboardLayout title="Admin" items={adminSidebar} />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>

      <Route
        path="/dashboard/user"
        element={
          <RequireSeller>
            <DashboardLayout title="User" items={userSidebar} />
          </RequireSeller>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route
          path="properties/new"
          element={
            <RequireSeller>
              <CreateProperty />
            </RequireSeller>
          }
        />
        <Route
          path="properties/:id/edit"
          element={
            <RequireSeller>
              <EditProperty />
            </RequireSeller>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
