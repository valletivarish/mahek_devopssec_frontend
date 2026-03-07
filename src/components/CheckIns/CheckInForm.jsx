import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkinSchema } from '../../utils/validators';
import checkinService from '../../services/checkinService';
import eventService from '../../services/eventService';
import attendeeService from '../../services/attendeeService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

/**
 * CheckInForm component for recording new attendee check-ins.
 * Features:
 * - Form validation using react-hook-form with yup checkinSchema
 * - Fields: eventId (dropdown), attendeeId (dropdown), checkInMethod (dropdown), notes (text)
 * - Event and Attendee dropdowns are dynamically populated from their respective services
 * - Check-in method options: QR_CODE and MANUAL
 * - On submit: calls checkinService.create to record the check-in
 * - Success toast notification and redirect back to /checkins
 * - Inline validation errors displayed below each field
 *
 * Note: Check-ins are create-only operations (no edit mode) since they represent
 * a point-in-time attendance record.
 */
function CheckInForm() {
  // Navigation hook for redirecting after form submission
  const navigate = useNavigate();

  // State for event options loaded from the API
  const [events, setEvents] = useState([]);

  // State for attendee options loaded from the API
  const [attendees, setAttendees] = useState([]);

  // Loading state for initial data fetch
  const [loading, setLoading] = useState(true);

  // Error state for displaying fetch errors
  const [error, setError] = useState('');

  // Track form submission state to prevent double-clicks
  const [submitting, setSubmitting] = useState(false);

  // Initialize react-hook-form with yup check-in validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(checkinSchema),
  });

  /**
   * On component mount, fetch events and attendees for the dropdown selectors.
   * Both are fetched in parallel using Promise.all for better performance.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, attendeesRes] = await Promise.all([
          eventService.getAll(),
          attendeeService.getAll(),
        ]);
        setEvents(eventsRes.data);
        setAttendees(attendeesRes.data);
      } catch (err) {
        setError('Failed to load form data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Handle form submission: create a new check-in record.
   * The backend will automatically set the check-in timestamp.
   */
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await checkinService.create(data);
      toast.success('Check-in recorded successfully.');
      // Redirect back to the check-ins list
      navigate('/checkins');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to record check-in. Please try again.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Display loading spinner while fetching dropdown data
  if (loading) return <LoadingSpinner />;

  // Display error message if data fetch failed
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page heading */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">New Check-In</h2>

      {/* Check-in form card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Event dropdown - populated from eventService.getAll() */}
          <div>
            <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-1">
              Event *
            </label>
            <select
              id="eventId"
              {...register('eventId')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.eventId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select an event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            {errors.eventId && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.eventId.message}</p>
            )}
          </div>

          {/* Attendee dropdown - populated from attendeeService.getAll() */}
          <div>
            <label htmlFor="attendeeId" className="block text-sm font-medium text-gray-700 mb-1">
              Attendee *
            </label>
            <select
              id="attendeeId"
              {...register('attendeeId')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.attendeeId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select an attendee</option>
              {attendees.map((attendee) => (
                <option key={attendee.id} value={attendee.id}>
                  {attendee.firstName} {attendee.lastName}
                </option>
              ))}
            </select>
            {errors.attendeeId && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.attendeeId.message}</p>
            )}
          </div>

          {/* Check-in method dropdown */}
          <div>
            <label htmlFor="checkInMethod" className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Method *
            </label>
            <select
              id="checkInMethod"
              {...register('checkInMethod')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.checkInMethod ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select method</option>
              <option value="QR_CODE">QR Code</option>
              <option value="MANUAL">Manual</option>
            </select>
            {errors.checkInMethod && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.checkInMethod.message}</p>
            )}
          </div>

          {/* Notes (optional text area) */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              rows="3"
              {...register('notes')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none ${
                errors.notes ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Any additional notes about this check-in"
            />
            {errors.notes && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.notes.message}</p>
            )}
          </div>

          {/* Form action buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/checkins')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Recording...' : 'Record Check-In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckInForm;
