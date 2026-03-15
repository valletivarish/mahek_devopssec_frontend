import { NavLink } from 'react-router-dom';
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
 * Left sidebar navigation component providing links to all application pages.
 * Features:
 * - Fixed position on the left side of the viewport
 * - Dark background (bg-gray-900) with white text for contrast
 * - Width of 64 (w-64 = 16rem) matching the main layout offset
 * - Each link uses NavLink with active styling to highlight the current page
 * - Icons from react-icons/fi precede each navigation label
 * - Full viewport height with scrollable content if needed
 */
function Sidebar() {
  /**
   * Navigation items array defining each sidebar link.
   * Each item has a path (route), label (display text), and icon component.
   */
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/events', label: 'Events', icon: FiCalendar },
    { path: '/attendees', label: 'Attendees', icon: FiUsers },
    { path: '/categories', label: 'Categories', icon: FiTag },
    { path: '/rsvps', label: 'RSVPs', icon: FiCheckCircle },
    { path: '/checkins', label: 'Check-ins', icon: FiUserCheck },
    { path: '/reports', label: 'Reports', icon: FiBarChart2 },
  ];

  return (
    // Fixed sidebar occupying the full height on the left
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-50">
      {/* Sidebar header / app logo area */}
      <div className="px-6 py-5 border-b border-gray-700">
        <h2 className="text-lg font-bold tracking-wide">RSVP Manager</h2>
        <p className="text-gray-400 text-xs mt-1">Event Attendance System</p>
      </div>

      {/* Navigation links list */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              {/*
                NavLink automatically adds an "active" class when the route matches.
                We use a function for className to apply different styles for active vs inactive states.
              */}
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
                {/* Icon for the navigation item */}
                <item.icon className="mr-3 text-lg" />
                {/* Label text */}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer area at the bottom of the sidebar */}
      <div className="px-6 py-4 border-t border-gray-700">
        <p className="text-gray-500 text-xs">Event RSVP &amp; Attendance</p>
      </div>
    </aside>
  );
}

export default Sidebar;
