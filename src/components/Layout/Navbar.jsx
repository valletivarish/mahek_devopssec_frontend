import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';

/**
 * Top navigation bar displayed across all authenticated pages.
 * Features:
 * - Application title "Event RSVP Manager" aligned to the left
 * - Current user info (username) displayed on the right
 * - Logout button that clears auth state and redirects to /login
 * - Fixed to the top of the viewport with a white background and shadow
 * - Offset to the right by the sidebar width (ml-64) so it doesn't overlap
 */
function Navbar() {
  // Navigation hook for redirecting after logout
  const navigate = useNavigate();

  // Auth context provides current user info and logout function
  const { user, logout } = useAuth();

  /**
   * Handle logout: clear auth state from context and localStorage,
   * then redirect the user back to the login page.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    // Fixed top navbar positioned to the right of the sidebar
    <nav className="fixed top-0 left-64 right-0 bg-white shadow-sm border-b border-gray-200 z-40">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Application title / branding */}
        <h1 className="text-xl font-bold text-gray-800">Event RSVP Manager</h1>

        {/* Right section: user info and logout button */}
        <div className="flex items-center space-x-4">
          {/* Display current user's username with a user icon */}
          <div className="flex items-center text-gray-600">
            <FiUser className="mr-2" />
            <span className="text-sm font-medium">{user?.username || 'User'}</span>
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${
              user?.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {user?.role || 'USER'}
            </span>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-red-600 transition text-sm font-medium"
          >
            <FiLogOut className="mr-1" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
