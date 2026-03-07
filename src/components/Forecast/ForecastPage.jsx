import { useState, useEffect } from 'react';
import { FiTrendingUp, FiTarget, FiDatabase } from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import forecastService from '../../services/forecastService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

/**
 * ForecastPage component displaying attendance forecasting analytics.
 * Features:
 * - Fetches prediction data from forecastService.getForecast()
 * - Displays three key forecast metrics in summary cards:
 *     1. Trend Direction - whether attendance is trending up, down, or stable
 *     2. Confidence Score - the model's confidence in its predictions (percentage)
 *     3. Data Points Used - how many historical records informed the forecast
 * - Line chart visualising predicted attendance for upcoming events (using recharts)
 * - Table of individual predictions showing event labels and predicted values
 * - Graceful handling of insufficient data (shows a helpful message)
 * - Loading spinner while data is being fetched from the API
 * - Error message display if the API call fails
 *
 * The forecast endpoint returns an object containing:
 * - trendDirection: string (e.g., "UPWARD", "DOWNWARD", "STABLE")
 * - confidenceScore: number (0-100 percentage)
 * - dataPointsUsed: number (count of historical records)
 * - predictions: array of { label, predictedAttendance } objects
 * - sufficientData: boolean indicating if enough data exists for predictions
 */
function ForecastPage() {
  // State for storing the fetched forecast data
  const [forecast, setForecast] = useState(null);

  // Loading state to show spinner during initial data fetch
  const [loading, setLoading] = useState(true);

  // Error state to display error messages if the API call fails
  const [error, setError] = useState('');

  /**
   * Fetch forecast data from the API on component mount.
   */
  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await forecastService.getForecast();
        setForecast(response.data);
      } catch (err) {
        setError('Failed to load forecast data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  // Display loading spinner while data is being fetched
  if (loading) return <LoadingSpinner />;

  // Display error message if the API call failed
  if (error) return <ErrorMessage message={error} />;

  /**
   * Format the trend direction enum into a human-readable label with colour styling.
   * @param {string} direction - The trend direction (UPWARD, DOWNWARD, STABLE)
   * @returns {object} Object with label text and Tailwind colour class
   */
  const getTrendInfo = (direction) => {
    const trends = {
      UPWARD: { label: 'Upward', color: 'text-green-600' },
      DOWNWARD: { label: 'Downward', color: 'text-red-600' },
      STABLE: { label: 'Stable', color: 'text-blue-600' },
    };
    return trends[direction] || { label: direction || 'Unknown', color: 'text-gray-600' };
  };

  const trendInfo = getTrendInfo(forecast?.trendDirection);

  // Extract predictions array for the chart and table
  const predictions = forecast?.predictions || [];

  /**
   * Prepare chart data by mapping predictions to the format expected by recharts.
   * Each data point has a "name" (event label) and "attendance" (predicted value).
   */
  const chartData = predictions.map((p) => ({
    name: p.label,
    attendance: p.predictedAttendance,
  }));

  return (
    <div>
      {/* Page heading */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Attendance Forecast</h2>

      {/* Check if there is sufficient data for predictions */}
      {forecast?.sufficientData === false ? (
        // Insufficient data message card
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <FiDatabase className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Insufficient Data</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            There is not enough historical attendance data to generate accurate predictions.
            Continue recording check-ins and RSVPs to build up the dataset needed for forecasting.
          </p>
        </div>
      ) : (
        <>
          {/* ==================== Forecast Metric Cards ==================== */}
          {/* Three summary cards displayed in a responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Trend Direction Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-3">
                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                  <FiTrendingUp className="text-xl text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-500">Trend Direction</h3>
              </div>
              {/* Trend label with colour based on direction */}
              <p className={`text-2xl font-bold ${trendInfo.color}`}>
                {trendInfo.label}
              </p>
            </div>

            {/* Confidence Score Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-3">
                <div className="bg-green-50 p-2 rounded-lg mr-3">
                  <FiTarget className="text-xl text-green-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-500">Confidence Score</h3>
              </div>
              {/* Confidence displayed as a percentage */}
              <p className="text-2xl font-bold text-gray-900">
                {forecast?.confidenceScore != null
                  ? `${forecast.confidenceScore}%`
                  : 'N/A'}
              </p>
            </div>

            {/* Data Points Used Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-3">
                <div className="bg-purple-50 p-2 rounded-lg mr-3">
                  <FiDatabase className="text-xl text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-500">Data Points Used</h3>
              </div>
              {/* Count of historical records used in the forecast */}
              <p className="text-2xl font-bold text-gray-900">
                {forecast?.dataPointsUsed ?? 'N/A'}
              </p>
            </div>
          </div>

          {/* ==================== Prediction Line Chart ==================== */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Predicted Attendance for Upcoming Events
            </h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {/* Line showing predicted attendance values across events */}
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={{ fill: '#4F46E5', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Predicted Attendance"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-12">
                No prediction data available to display.
              </p>
            )}
          </div>

          {/* ==================== Predictions Table ==================== */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Details</h3>
            {predictions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="pb-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Event / Label
                      </th>
                      <th className="pb-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Predicted Attendance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* Render each prediction as a table row */}
                    {predictions.map((prediction, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition">
                        {/* Event label or identifier */}
                        <td className="py-3 text-sm font-medium text-gray-900">
                          {prediction.label}
                        </td>
                        {/* Predicted attendance value */}
                        <td className="py-3 text-sm text-gray-600">
                          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                            {prediction.predictedAttendance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No predictions available at this time.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ForecastPage;
