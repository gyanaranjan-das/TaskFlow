import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LoadingScreen from '../shared/LoadingScreen';

/**
 * Auth guard - redirects to login if not authenticated
 */
const AuthGuard = ({ children }) => {
  const { user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
