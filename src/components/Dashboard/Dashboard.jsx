import { useState, useEffect } from 'react';
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiThumbsUp,
  FiUsers,
  FiPercent,
} from 'react-icons/fi';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import dashboardService from '../../services/dashboardService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

/**
 * Colour palette used for pie chart segments and other chart elements.
 * Provides a visually distinct set of colours for up to 6 data points.
 */
const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

/**
 * Dashboard component displaying a comprehensive overview of the event management system.
 * Features:
 * - 6 summary statistic cards in a responsive grid layout
 * - Pie chart visualising RSVP distribution by status (Confirmed, Declined, Maybe, etc.)
 * - Bar chart showing the number of events grouped by category
 * - Line chart displaying the monthly event creation trend over time
 * - Recent events table listing the latest 5 events with key details
 * - Loading spinner while data is being fetched from the API
 * - Error message display if the API call fails
 *
 * Data is fetched from dashboardService.getDashboardData() which returns an aggregated
 * response containing all metrics, chart data, and recent events.
 */
function Dashboard() {
  // State for storing the fetched dashboard data
  const [data, setData] = useState(null);

  // Loading state to show spinner during initial data fetch
  const [loading, setLoading] = useState(true);

  // Error state to display error messages if the API call fails
  const [error, setError] = useState('');

  /**
   * Fetch dashboard data from the API on component mount.
   * The API returns an object containing summary stats, chart data, and recent events.
   */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardService.getDashboardData();
        setData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Display loading spinner while data is being fetched
  if (loading) return <LoadingSpinner />;

  // Display error message if the API call failed
  if (error) return <ErrorMessage message={error} />;

  /**
   * Summary cards configuration array.
   * Each card displays an icon, a numeric value, and a descriptive label.
   * Values are sourced from the dashboard API response with sensible fallbacks.
   */
  const summaryCards = [
    {
      label: 'Total Events',
      value: data?.totalEvents || 0,
      icon: FiCalendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Upcoming Events',
      value: data?.upcomingEvents || 0,
      icon: FiClock,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total RSVPs',
      value: data?.totalRsvps || 0,
      icon: FiCheckCircle,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Confirmed RSVPs',
      value: data?.confirmedRsvps || 0,
      icon: FiThumbsUp,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Total Attendees',
      value: data?.totalAttendees || 0,
      icon: FiUsers,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Attendance Rate',
      value: `${parseFloat(data?.attendanceRate || 0).toFixed(1)}%`,
      icon: FiPercent,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
  ];

  // Convert API response objects (Map<String, Long>) to arrays for Recharts
  const rsvpsByStatus = data?.rsvpsByStatus
    ? Object.entries(data.rsvpsByStatus).map(([name, value]) => ({ name, value }))
    : [];
  const eventsByCategory = data?.eventsByCategory
    ? Object.entries(data.eventsByCategory).map(([name, count]) => ({ name, count }))
    : [];
  const monthlyTrend = data?.monthlyEventCounts
    ? Object.entries(data.monthlyEventCounts).map(([month, count]) => ({ month, count }))
    : [];
  const recentEvents = data?.recentEvents || [];

  return (
    <div>
      {/* Page heading */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      {/* ==================== Summary Cards Grid ==================== */}
      {/* Responsive grid: 1 column on mobile, 2 on medium, 3 on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center"
          >
            {/* Icon container with coloured background */}
            <div className={`${card.bg} p-3 rounded-lg mr-4`}>
              <card.icon className={`text-2xl ${card.color}`} />
            </div>
            {/* Value and label text */}
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ==================== Charts Section ==================== */}
      {/* Two charts side by side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* ---------- Pie Chart: RSVPs by Status ---------- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">RSVPs by Status</h3>
          {rsvpsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rsvpsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  /* Display the name and percentage on each pie slice label */
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {/* Apply distinct colours to each pie segment from the COLORS array */}
                  {rsvpsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">No RSVP data available</p>
          )}
        </div>

        {/* ---------- Bar Chart: Events by Category ---------- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Events by Category</h3>
          {eventsByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventsByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Bar colour matches the primary brand colour */}
                <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">No category data available</p>
          )}
        </div>
      </div>

      {/* ---------- Line Chart: Monthly Event Trend ---------- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Event Trend</h3>
        {monthlyTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Line representing event count per month */}
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ fill: '#4F46E5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center py-12">No trend data available</p>
        )}
      </div>

      {/* ==================== Recent Events Table ==================== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
        {recentEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-sm font-semibold text-gray-600">Title</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Date</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Location</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">RSVPs</th>
                </tr>
              </thead>
              <tbody>
                {/* Render up to 5 recent events as table rows */}
                {recentEvents.slice(0, 5).map((event) => (
                  <tr key={event.id} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900 font-medium">{event.title}</td>
                    <td className="py-3 text-sm text-gray-600">{event.eventDate}</td>
                    <td className="py-3 text-sm text-gray-600">{event.location}</td>
                    <td className="py-3">
                      {/* Status badge with colour coding based on event status */}
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          event.status === 'UPCOMING'
                            ? 'bg-blue-100 text-blue-700'
                            : event.status === 'ONGOING'
                            ? 'bg-green-100 text-green-700'
                            : event.status === 'COMPLETED'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{event.rsvpCount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No recent events found</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
