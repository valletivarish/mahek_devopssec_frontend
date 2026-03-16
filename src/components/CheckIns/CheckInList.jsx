import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import checkinService from '../../services/checkinService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';

/**
 * CheckInList component displays all check-in records in a tabular format.
 * Features:
 * - Page title with "New Check-In" navigation button
 * - Table columns: Event, Attendee, Check-In Time, Method, Notes, Actions
 * - Check-in method displayed as a readable label (QR_CODE -> "QR Code", MANUAL -> "Manual")
 * - Delete button opens a confirmation dialog before removal
 * - Toast notifications for successful deletion or API errors
 * - Loading spinner and error message handling
 *
 * Note: Check-ins are typically create-only (no edit), so only delete actions are shown.
 */
function CheckInList() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  // State for the list of check-ins fetched from the API
  const [checkins, setCheckins] = useState([]);

  // Loading state for initial data fetch
  const [loading, setLoading] = useState(true);

  // Error state for displaying API error messages
  const [error, setError] = useState('');

  // State controlling the delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, checkinId: null });

  /**
   * Fetch all check-ins from the API on component mount.
   */
  useEffect(() => {
    fetchCheckins();
  }, []);

  /**
   * Retrieve the full list of check-ins from the backend.
   */
  const fetchCheckins = async () => {
    try {
      setLoading(true);
      const response = await checkinService.getAll();
      setCheckins(response.data);
    } catch (err) {
      setError('Failed to load check-ins. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Open the delete confirmation dialog for a specific check-in.
   * @param {number} id - The ID of the check-in to delete
   */
  const handleDeleteClick = (id) => {
    setDeleteDialog({ isOpen: true, checkinId: id });
  };

  /**
   * Confirm deletion: call the API, remove from state, show toast.
   */
  const handleDeleteConfirm = async () => {
    try {
      await checkinService.delete(deleteDialog.checkinId);
      setCheckins((prev) => prev.filter((c) => c.id !== deleteDialog.checkinId));
      toast.success('Check-in deleted successfully.');
    } catch (err) {
      toast.error('Failed to delete check-in. Please try again.');
    } finally {
      setDeleteDialog({ isOpen: false, checkinId: null });
    }
  };

  /**
   * Cancel the delete operation and close the dialog.
   */
  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, checkinId: null });
  };

  /**
   * Format the check-in method enum value into a human-readable label.
   * @param {string} method - The check-in method (QR_CODE, MANUAL)
   * @returns {string} Human-readable method label
   */
  const formatMethod = (method) => {
    const methods = {
      QR_CODE: 'QR Code',
      MANUAL: 'Manual',
    };
    return methods[method] || method;
  };

  // Display loading spinner while data is being fetched
  if (loading) return <LoadingSpinner />;

  // Display error message if the API call failed
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {/* Page header with title and New Check-In button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Check-ins</h2>
        <Link
          to="/checkins/new"
          className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium text-sm"
        >
          <FiPlus className="mr-2" />
          New Check-In
        </Link>
      </div>

      {/* Check-ins data table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Attendee</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Check-In Time</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Notes</th>
                {isAdmin && <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {checkins.length > 0 ? (
                checkins.map((checkin) => (
                  <tr key={checkin.id} className="hover:bg-gray-50 transition">
                    {/* Event name - supports both nested object and flat field patterns */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {checkin.eventTitle || checkin.event?.title || '-'}
                    </td>
                    {/* Attendee name - supports both nested object and flat field patterns */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {checkin.attendeeName ||
                        (checkin.attendee
                          ? `${checkin.attendee.firstName} ${checkin.attendee.lastName}`
                          : '-')}
                    </td>
                    {/* Check-in timestamp formatted to locale string */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {checkin.checkInTime
                        ? new Date(checkin.checkInTime).toLocaleString()
                        : '-'}
                    </td>
                    {/* Check-in method (QR Code or Manual) */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {formatMethod(checkin.checkInMethod)}
                      </span>
                    </td>
                    {/* Notes with fallback */}
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {checkin.notes || '-'}
                    </td>
                    {/* Delete action button - ADMIN only */}
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteClick(checkin.id)}
                          className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition"
                          title="Delete check-in"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                // Empty state when no check-ins exist
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-gray-400">
                    No check-ins recorded yet. Record your first check-in to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Check-in"
        message="Are you sure you want to delete this check-in record? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

export default CheckInList;
