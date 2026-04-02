import { useState, useEffect } from 'react';
import { FiBarChart2, FiPieChart, FiActivity, FiAward } from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import dashboardService from '../../services/dashboardService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

/**
 * ReportsPage component displaying event attendance reports and analytics.
 * Non-CRUD feature that aggregates data from the dashboard API to provide:
 * - Attendance summary metrics (rate, check-ins vs RSVPs)
 * - RSVP status breakdown per event category
 * - Top events by confirmed RSVPs
 * - Category performance comparison
 */
function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardService.getDashboardData();
        setData(response.data);
      } catch (err) {
        setError('Failed to load report data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const attendanceRate = data?.attendanceRate?.toFixed(1) || '0.0';
  const totalCheckIns = data?.totalCheckIns || 0;
  const confirmedRsvps = data?.confirmedRsvps || 0;
  const totalRsvps = data?.totalRsvps || 0;
  const noShowRate = confirmedRsvps > 0
    ? ((1 - totalCheckIns / confirmedRsvps) * 100).toFixed(1)
    : '0.0';

  // RSVP status data for pie chart
  const rsvpStatusData = data?.rsvpsByStatus
    ? Object.entries(data.rsvpsByStatus).map(([name, value]) => ({ name, value }))
    : [];

  // Category data for bar chart
  const categoryData = data?.eventsByCategory
    ? Object.entries(data.eventsByCategory).map(([name, count]) => ({ name, count }))
    : [];

  // Recent events sorted by confirmed count
  const topEvents = [...(data?.recentEvents || [])]
    .sort((a, b) => (b.confirmedCount || 0) - (a.confirmedCount || 0))
    .slice(0, 5);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Reports</h2>

      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-3">
            <div className="bg-green-50 p-2 rounded-lg mr-3">
              <FiActivity className="text-xl text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-500">Attendance Rate</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">{attendanceRate}%</p>
          <p className="text-xs text-gray-400 mt-1">Check-ins / Confirmed RSVPs</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-3">
            <div className="bg-red-50 p-2 rounded-lg mr-3">
              <FiBarChart2 className="text-xl text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-500">No-Show Rate</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">{noShowRate}%</p>
          <p className="text-xs text-gray-400 mt-1">Confirmed but did not attend</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-3">
            <div className="bg-blue-50 p-2 rounded-lg mr-3">
              <FiPieChart className="text-xl text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-500">RSVP Conversion</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {totalRsvps > 0 ? ((confirmedRsvps / totalRsvps) * 100).toFixed(1) : '0.0'}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Confirmed / Total RSVPs</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-3">
            <div className="bg-purple-50 p-2 rounded-lg mr-3">
              <FiAward className="text-xl text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-500">Total Check-ins</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">{totalCheckIns}</p>
          <p className="text-xs text-gray-400 mt-1">Across all events</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* RSVP Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">RSVP Status Distribution</h3>
          {rsvpStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rsvpStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent, x, y }) =>
                    percent > 0.05 ? (
                      <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={12} fill="#374151">
                        {`${name} (${(percent * 100).toFixed(0)}%)`}
                      </text>
                    ) : null
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {rsvpStatusData.map((entry, index) => (
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

        {/* Events by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Events by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Events" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">No category data available</p>
          )}
        </div>
      </div>

      {/* Top Events Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Events by Confirmed RSVPs</h3>
        {topEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="pb-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
                  <th className="pb-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Event</th>
                  <th className="pb-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="pb-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                  <th className="pb-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Capacity</th>
                  <th className="pb-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Confirmed</th>
                  <th className="pb-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Fill Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topEvents.map((event, index) => {
                  const fillRate = event.capacity > 0
                    ? ((event.confirmedCount || 0) / event.capacity * 100).toFixed(0)
                    : 0;
                  return (
                    <tr key={event.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 text-sm font-bold text-gray-400">#{index + 1}</td>
                      <td className="py-3 text-sm font-medium text-gray-900">{event.title}</td>
                      <td className="py-3 text-sm text-gray-600">{event.eventDate}</td>
                      <td className="py-3 text-sm text-gray-600">{event.location}</td>
                      <td className="py-3 text-sm text-gray-600">{event.capacity}</td>
                      <td className="py-3">
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                          {event.confirmedCount || 0}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${Math.min(fillRate, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{fillRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No events found</p>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;
