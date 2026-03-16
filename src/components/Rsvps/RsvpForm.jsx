import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { rsvpSchema } from '../../utils/validators';
import rsvpService from '../../services/rsvpService';
import eventService from '../../services/eventService';
import attendeeService from '../../services/attendeeService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

/**
 * RsvpForm component for creating and editing RSVP records.
 * Admin users can select any attendee from the dropdown.
 * Regular users are auto-assigned to their linked attendee record.
 */
function RsvpForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(rsvpSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, attendeesRes] = await Promise.all([
          eventService.getAll(),
          attendeeService.getAll(),
        ]);
        setEvents(eventsRes.data);
        setAttendees(attendeesRes.data);

        // For non-admin users, auto-set their linked attendee
        if (!isAdmin && user?.attendeeId) {
          setValue('attendeeId', user.attendeeId);
        }

        if (isEditMode) {
          const rsvpRes = await rsvpService.getById(id);
          const rsvp = rsvpRes.data;
          reset({
            eventId: rsvp.eventId || rsvp.event?.id,
            attendeeId: rsvp.attendeeId || rsvp.attendee?.id,
            status: rsvp.status,
            dietaryPreferences: rsvp.dietaryPreferences || '',
            specialRequirements: rsvp.specialRequirements || '',
          });
        }
      } catch (err) {
        setError('Failed to load form data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode, reset, isAdmin, user, setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (isEditMode) {
        await rsvpService.update(id, data);
        toast.success('RSVP updated successfully.');
      } else {
        await rsvpService.create(data);
        toast.success('RSVP created successfully.');
      }
      navigate('/rsvps');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to save RSVP. Please try again.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit RSVP' : 'Create New RSVP'}
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Event dropdown */}
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

          {/* Attendee dropdown - admin sees all, user sees only themselves */}
          {isAdmin ? (
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
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendee</label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <input type="hidden" {...register('attendeeId')} />
            </div>
          )}

          {/* RSVP Status dropdown */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              id="status"
              {...register('status')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.status ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="DECLINED">Declined</option>
              <option value="MAYBE">Maybe</option>
              <option value="WAITLISTED">Waitlisted</option>
            </select>
            {errors.status && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>

          {/* Dietary preferences */}
          <div>
            <label htmlFor="dietaryPreferences" className="block text-sm font-medium text-gray-700 mb-1">
              Dietary Preferences
            </label>
            <input
              id="dietaryPreferences"
              type="text"
              {...register('dietaryPreferences')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.dietaryPreferences ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Vegetarian, Gluten-free"
            />
            {errors.dietaryPreferences && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.dietaryPreferences.message}</p>
            )}
          </div>

          {/* Special requirements */}
          <div>
            <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-1">
              Special Requirements
            </label>
            <textarea
              id="specialRequirements"
              rows="3"
              {...register('specialRequirements')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none ${
                errors.specialRequirements ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Any special requirements or notes"
            />
            {errors.specialRequirements && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.specialRequirements.message}</p>
            )}
          </div>

          {/* Form action buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/rsvps')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? 'Saving...'
                : isEditMode
                ? 'Update RSVP'
                : 'Create RSVP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RsvpForm;
