import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import eventService from '../../services/eventService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';

/**
 * EventList component displays all events in a searchable, tabular format.
 * Features:
 * - Page title with "Add Event" navigation button
 * - Search input that filters events by title (debounced on keystroke)
 * - Responsive table showing: Title, Date, Time, Location, Capacity, Status, Category, Actions
 * - Status badges with colour coding: UPCOMING=blue, ONGOING=green, COMPLETED=gray, CANCELLED=red
 * - Capacity column shows confirmed RSVPs vs total capacity (e.g., "15/50")
 * - Edit button links to the event edit form
 * - Delete button opens a confirmation dialog before deleting
 * - Toast notifications for successful deletion or API errors
 * - Loading spinner and error message states
 */
function EventList() {
  // State for the list of events fetched from the API
  const [events, setEvents] = useState([]);

  // Loading state for initial data fetch
  const [loading, setLoading] = useState(true);

  // Error state for displaying API error messages
  const [error, setError] = useState('');

  // Search query state for filtering events by title
  const [searchQuery, setSearchQuery] = useState('');

  // State controlling the visibility and target of the delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, eventId: null });

  /**
   * Fetch all events from the API on component mount.
   */
  useEffect(() => {
    fetchEvents();
  }, []);

  /**
   * Retrieve the full list of events from the backend.
   * Updates loading and error states accordingly.
   */
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAll();
      setEvents(response.data);
    } catch (err) {
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Open the delete confirmation dialog for a specific event.
   * @param {number} id - The ID of the event to delete
   */
  const handleDeleteClick = (id) => {
    setDeleteDialog({ isOpen: true, eventId: id });
  };

  /**
   * Confirm deletion: call the API, remove the event from state, show toast.
   */
  const handleDeleteConfirm = async () => {
    try {
      await eventService.delete(deleteDialog.eventId);
      // Remove the deleted event from the local state without re-fetching
      setEvents((prev) => prev.filter((e) => e.id !== deleteDialog.eventId));
      toast.success('Event deleted successfully.');
    } catch (err) {
      toast.error('Failed to delete event. Please try again.');
    } finally {
      setDeleteDialog({ isOpen: false, eventId: null });
    }
  };

  /**
   * Cancel the delete operation and close the dialog.
   */
  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, eventId: null });
  };

  /**
   * Return the appropriate Tailwind CSS classes for each event status badge.
   * @param {string} status - The event status string
   * @returns {string} Tailwind CSS class string for the badge
   */
  const getStatusBadge = (status) => {
    const badges = {
      UPCOMING: 'bg-blue-100 text-blue-700',
      ONGOING: 'bg-green-100 text-green-700',
      COMPLETED: 'bg-gray-100 text-gray-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  /**
   * Filter events based on the search query (case-insensitive title match).
   */
  const filteredEvents = events.filter((event) =>
    event.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Display loading spinner while data is being fetched
  if (loading) return <LoadingSpinner />;

  // Display error message if the API call failed
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {/* Page header with title and Add Event button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Events</h2>
        <Link
          to="/events/new"
          className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium text-sm"
        >
          <FiPlus className="mr-2" />
          Add Event
        </Link>
      </div>

      {/* Search input for filtering events by title */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Events data table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition">
                    {/* Event title */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.title}</td>
                    {/* Event date */}
                    <td className="px-6 py-4 text-sm text-gray-600">{event.eventDate}</td>
                    {/* Event time range (start - end) */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {event.startTime} - {event.endTime}
                    </td>
                    {/* Event location */}
                    <td className="px-6 py-4 text-sm text-gray-600">{event.location}</td>
                    {/* Confirmed RSVPs / Total capacity */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {event.confirmedCount || 0}/{event.capacity}
                    </td>
                    {/* Colour-coded status badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusBadge(event.status)}`}
                      >
                        {event.status}
                      </span>
                    </td>
                    {/* Category name */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {event.categoryName || event.category?.name || '-'}
                    </td>
                    {/* Action buttons: Edit and Delete */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/events/edit/${event.id}`}
                          className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition"
                          title="Edit event"
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(event.id)}
                          className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition"
                          title="Delete event"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // Empty state when no events match the search or none exist
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                    No events found.
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
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

export default EventList;
