import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiTag,
  FiCheckCircle,
  FiUserCheck,
  FiBarChart2,
} from 'react-icons/fi';

/**
 * Left sidebar navigation with role-based access control.
 * ADMIN: sees all navigation items (Dashboard, Events, Attendees, Categories, RSVPs, Check-ins, Reports)
 * USER: sees only Dashboard, Events, RSVPs, and Check-ins
 */
function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome, roles: ['ADMIN', 'USER'] },
    { path: '/events', label: 'Events', icon: FiCalendar, roles: ['ADMIN', 'USER'] },
    { path: '/attendees', label: 'Attendees', icon: FiUsers, roles: ['ADMIN'] },
    { path: '/categories', label: 'Categories', icon: FiTag, roles: ['ADMIN'] },
    { path: '/rsvps', label: 'RSVPs', icon: FiCheckCircle, roles: ['ADMIN', 'USER'] },
    { path: '/checkins', label: 'Check-ins', icon: FiUserCheck, roles: ['ADMIN', 'USER'] },
    { path: '/reports', label: 'Reports', icon: FiBarChart2, roles: ['ADMIN'] },
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(user?.role || 'USER'));

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-50">
      <div className="px-6 py-5 border-b border-gray-700">
        <h2 className="text-lg font-bold tracking-wide">RSVP Manager</h2>
        <p className="text-gray-400 text-xs mt-1">Event Attendance System</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {visibleItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 text-lg" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-6 py-4 border-t border-gray-700">
        <p className="text-gray-500 text-xs">{isAdmin ? 'Admin Panel' : 'User Panel'}</p>
      </div>
    </aside>
  );
}

export default Sidebar;
