import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Route guard component that redirects unauthenticated users to the login page.
 * Shows a loading spinner while the auth state is being restored from localStorage.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show spinner while checking auth state from localStorage
  if (loading) return <LoadingSpinner />;

  // Redirect to login if not authenticated
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
