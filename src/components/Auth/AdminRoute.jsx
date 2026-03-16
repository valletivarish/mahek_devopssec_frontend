import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Route guard that restricts access to ADMIN users only.
 * Redirects non-admin users to the dashboard.
 */
function AdminRoute({ children }) {
  const { user } = useAuth();

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
