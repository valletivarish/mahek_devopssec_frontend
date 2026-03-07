import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import attendeeService from '../../services/attendeeService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';

/**
 * AttendeeList component displays all attendees in a searchable table format.
 * Features:
 * - Page title with "Add Attendee" navigation button
 * - Search input for filtering attendees by name or email
 * - Table columns: Name (first + last), Email, Phone, Organisation, Actions
 * - Edit button navigates to the attendee edit form
 * - Delete button opens a confirmation dialog before removal
 * - Toast notifications for successful deletion or API errors
 * - Loading spinner and error message handling
 */
function AttendeeList() {
  // State for the list of attendees fetched from the API
  const [attendees, setAttendees] = useState([]);

  // Loading state for initial data fetch
  const [loading, setLoading] = useState(true);

  // Error state for displaying API error messages
  const [error, setError] = useState('');

  // Search query state for filtering attendees
  const [searchQuery, setSearchQuery] = useState('');

  // State controlling the delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, attendeeId: null });

  /**
   * Fetch all attendees from the API on component mount.
   */
  useEffect(() => {
    fetchAttendees();
  }, []);

  /**
   * Retrieve the full list of attendees from the backend.
   */
  const fetchAttendees = async () => {
    try {
      setLoading(true);
      const response = await attendeeService.getAll();
      setAttendees(response.data);
    } catch (err) {
      setError('Failed to load attendees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Open the delete confirmation dialog for a specific attendee.
   * @param {number} id - The ID of the attendee to delete
   */
  const handleDeleteClick = (id) => {
    setDeleteDialog({ isOpen: true, attendeeId: id });
  };

  /**
   * Confirm deletion: call the API, remove from state, show toast.
   */
  const handleDeleteConfirm = async () => {
    try {
      await attendeeService.delete(deleteDialog.attendeeId);
      setAttendees((prev) => prev.filter((a) => a.id !== deleteDialog.attendeeId));
      toast.success('Attendee deleted successfully.');
    } catch (err) {
      toast.error('Failed to delete attendee. Please try again.');
    } finally {
      setDeleteDialog({ isOpen: false, attendeeId: null });
    }
  };

  /**
   * Cancel the delete operation and close the dialog.
   */
  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, attendeeId: null });
  };

  /**
   * Filter attendees based on search query (matches name, email, or organisation).
   */
  const filteredAttendees = attendees.filter((attendee) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${attendee.firstName} ${attendee.lastName}`.toLowerCase();
    return (
      fullName.includes(query) ||
      attendee.email?.toLowerCase().includes(query) ||
      attendee.organization?.toLowerCase().includes(query)
    );
  });

  // Display loading spinner while data is being fetched
  if (loading) return <LoadingSpinner />;

  // Display error message if the API call failed
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {/* Page header with title and Add Attendee button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Attendees</h2>
        <Link
          to="/attendees/new"
          className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium text-sm"
        >
          <FiPlus className="mr-2" />
          Add Attendee
        </Link>
      </div>

      {/* Search input for filtering attendees */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or organisation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Attendees data table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Organisation</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((attendee) => (
                  <tr key={attendee.id} className="hover:bg-gray-50 transition">
                    {/* Full name (first name + last name) */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {attendee.firstName} {attendee.lastName}
                    </td>
                    {/* Email address */}
                    <td className="px-6 py-4 text-sm text-gray-600">{attendee.email}</td>
                    {/* Phone number with fallback */}
                    <td className="px-6 py-4 text-sm text-gray-600">{attendee.phone || '-'}</td>
                    {/* Organisation with fallback */}
                    <td className="px-6 py-4 text-sm text-gray-600">{attendee.organization || '-'}</td>
                    {/* Action buttons: Edit and Delete */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/attendees/edit/${attendee.id}`}
                          className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition"
                          title="Edit attendee"
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(attendee.id)}
                          className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition"
                          title="Delete attendee"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // Empty state when no attendees match the search or none exist
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No attendees found.
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
        title="Delete Attendee"
        message="Are you sure you want to delete this attendee? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

export default AttendeeList;
