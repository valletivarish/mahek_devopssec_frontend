import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';
import Dashboard from './components/Dashboard/Dashboard';
import EventList from './components/Events/EventList';
import EventForm from './components/Events/EventForm';
import AttendeeList from './components/Attendees/AttendeeList';
import AttendeeForm from './components/Attendees/AttendeeForm';
import CategoryList from './components/Categories/CategoryList';
import CategoryForm from './components/Categories/CategoryForm';
import RsvpList from './components/Rsvps/RsvpList';
import RsvpForm from './components/Rsvps/RsvpForm';
import CheckInList from './components/CheckIns/CheckInList';
import CheckInForm from './components/CheckIns/CheckInForm';
import ReportsPage from './components/Reports/ReportsPage';

/**
 * Main application component with role-based routing.
 * ADMIN: full access to all routes
 * USER: Dashboard, Events (view-only), RSVPs, Check-ins
 */
function App() {
  return (
    <Routes>
      {/* Public authentication routes */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* Protected routes wrapped in MainLayout with sidebar and navbar */}
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Events - viewable by all, create/edit only by ADMIN */}
        <Route path="events" element={<EventList />} />
        <Route path="events/new" element={<AdminRoute><EventForm /></AdminRoute>} />
        <Route path="events/edit/:id" element={<AdminRoute><EventForm /></AdminRoute>} />

        {/* Attendee management - ADMIN only */}
        <Route path="attendees" element={<AdminRoute><AttendeeList /></AdminRoute>} />
        <Route path="attendees/new" element={<AdminRoute><AttendeeForm /></AdminRoute>} />
        <Route path="attendees/edit/:id" element={<AdminRoute><AttendeeForm /></AdminRoute>} />

        {/* Category management - ADMIN only */}
        <Route path="categories" element={<AdminRoute><CategoryList /></AdminRoute>} />
        <Route path="categories/new" element={<AdminRoute><CategoryForm /></AdminRoute>} />
        <Route path="categories/edit/:id" element={<AdminRoute><CategoryForm /></AdminRoute>} />

        {/* RSVP management - accessible by all authenticated users */}
        <Route path="rsvps" element={<RsvpList />} />
        <Route path="rsvps/new" element={<RsvpForm />} />
        <Route path="rsvps/edit/:id" element={<RsvpForm />} />

        {/* Check-in management - accessible by all authenticated users */}
        <Route path="checkins" element={<CheckInList />} />
        <Route path="checkins/new" element={<CheckInForm />} />

        {/* Reports - ADMIN only */}
        <Route path="reports" element={<AdminRoute><ReportsPage /></AdminRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
