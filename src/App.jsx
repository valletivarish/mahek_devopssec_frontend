import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ProtectedRoute from './components/Auth/ProtectedRoute';
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
 * Main application component defining all routes.
 * Public routes: login, register
 * Protected routes: dashboard, events, attendees, categories, RSVPs, check-ins, reports
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

        {/* Event management routes */}
        <Route path="events" element={<EventList />} />
        <Route path="events/new" element={<EventForm />} />
        <Route path="events/edit/:id" element={<EventForm />} />

        {/* Attendee management routes */}
        <Route path="attendees" element={<AttendeeList />} />
        <Route path="attendees/new" element={<AttendeeForm />} />
        <Route path="attendees/edit/:id" element={<AttendeeForm />} />

        {/* Category management routes */}
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/new" element={<CategoryForm />} />
        <Route path="categories/edit/:id" element={<CategoryForm />} />

        {/* RSVP management routes */}
        <Route path="rsvps" element={<RsvpList />} />
        <Route path="rsvps/new" element={<RsvpForm />} />
        <Route path="rsvps/edit/:id" element={<RsvpForm />} />

        {/* Check-in management routes */}
        <Route path="checkins" element={<CheckInList />} />
        <Route path="checkins/new" element={<CheckInForm />} />

        {/* Event reports and analytics page */}
        <Route path="reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
