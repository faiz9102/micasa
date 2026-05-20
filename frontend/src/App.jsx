
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { hydrateAuth } from './features/auth/authSlice';
// Importing global styles.
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return <AppRoutes />;
};
export default App;