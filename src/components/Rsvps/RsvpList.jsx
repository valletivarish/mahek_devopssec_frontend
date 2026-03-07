import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import rsvpService from '../../services/rsvpService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';

/**
 * RsvpList component displays all RSVP records in a tabular format.
 * Features:
 * - Page title with "Add RSVP" navigation button
 * - Table columns: Event, Attendee, Status (colour-coded badge), Dietary Prefs, Responded At, Actions
 * - Status badges with colour coding:
 *     CONFIRMED = green, DECLINED = red, MAYBE = yellow, WAITLISTED = purple
 * - Edit button navigates to the RSVP edit form
 * - Delete button opens a confirmation dialog before removal
 * - Toast notifications for successful deletion or API errors
 * - Loading spinner and error message handling
 */
function RsvpList() {
  // State for the list of RSVPs fetched from the API
  const [rsvps, setRsvps] = useState([]);

  // Loading state for initial data fetch
  const [loading, setLoading] = useState(true);

  // Error state for displaying API error messages
  const [error, setError] = useState('');

  // State controlling the delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, rsvpId: null });

  /**
   * Fetch all RSVPs from the API on component mount.
   */
  useEffect(() => {
    fetchRsvps();
  }, []);

  /**
   * Retrieve the full list of RSVPs from the backend.
   */
  const fetchRsvps = async () => {
    try {
      setLoading(true);
      const response = await rsvpService.getAll();
      setRsvps(response.data);
    } catch (err) {
      setError('Failed to load RSVPs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Open the delete confirmation dialog for a specific RSVP.
   * @param {number} id - The ID of the RSVP to delete
   */
  const handleDeleteClick = (id) => {
    setDeleteDialog({ isOpen: true, rsvpId: id });
  };

  /**
   * Confirm deletion: call the API, remove from state, show toast.
   */
  const handleDeleteConfirm = async () => {
    try {
      await rsvpService.delete(deleteDialog.rsvpId);
      setRsvps((prev) => prev.filter((r) => r.id !== deleteDialog.rsvpId));
      toast.success('RSVP deleted successfully.');
    } catch (err) {
      toast.error('Failed to delete RSVP. Please try again.');
    } finally {
      setDeleteDialog({ isOpen: false, rsvpId: null });
    }
  };

  /**
   * Cancel the delete operation and close the dialog.
   */
  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, rsvpId: null });
  };

  /**
   * Return the appropriate Tailwind CSS classes for each RSVP status badge.
   * @param {string} status - The RSVP status string
   * @returns {string} Tailwind CSS class string for the badge
   */
  const getStatusBadge = (status) => {
    const badges = {
      CONFIRMED: 'bg-green-100 text-green-700',
      DECLINED: 'bg-red-100 text-red-700',
      MAYBE: 'bg-yellow-100 text-yellow-700',
      WAITLISTED: 'bg-purple-100 text-purple-700',
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  // Display loading spinner while data is being fetched
  if (loading) return <LoadingSpinner />;

  // Display error message if the API call failed
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {/* Page header with title and Add RSVP button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">RSVPs</h2>
        <Link
          to="/rsvps/new"
          className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium text-sm"
        >
          <FiPlus className="mr-2" />
          Add RSVP
        </Link>
      </div>

      {/* RSVPs data table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Attendee</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Dietary Prefs</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Responded At</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rsvps.length > 0 ? (
                rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-gray-50 transition">
                    {/* Event name - supports both nested object and flat field patterns */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {rsvp.eventTitle || rsvp.event?.title || '-'}
                    </td>
                    {/* Attendee name - supports both nested object and flat field patterns */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {rsvp.attendeeName ||
                        (rsvp.attendee
                          ? `${rsvp.attendee.firstName} ${rsvp.attendee.lastName}`
                          : '-')}
                    </td>
                    {/* Colour-coded RSVP status badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusBadge(rsvp.status)}`}
                      >
                        {rsvp.status}
                      </span>
                    </td>
                    {/* Dietary preferences with fallback */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {rsvp.dietaryPreferences || '-'}
                    </td>
                    {/* Responded at timestamp - format if available */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {rsvp.respondedAt
                        ? new Date(rsvp.respondedAt).toLocaleString()
                        : '-'}
                    </td>
                    {/* Action buttons: Edit and Delete */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/rsvps/edit/${rsvp.id}`}
                          className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition"
                          title="Edit RSVP"
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(rsvp.id)}
                          className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition"
                          title="Delete RSVP"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // Empty state when no RSVPs exist
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    No RSVPs found. Create your first RSVP to get started.
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
        title="Delete RSVP"
        message="Are you sure you want to delete this RSVP? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

export default RsvpList;
