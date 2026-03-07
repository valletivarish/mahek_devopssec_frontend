import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * Main layout wrapper providing the sidebar navigation and top navbar.
 * The Outlet renders the matched child route content in the main area.
 */
function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        {/* Main content area with padding for navbar and sidebar */}
        <main className="pt-16 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
