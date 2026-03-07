import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { eventSchema } from '../../utils/validators';
import eventService from '../../services/eventService';
import categoryService from '../../services/categoryService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

/**
 * EventForm component for creating and editing events.
 * Features:
 * - Detects edit mode based on the presence of an :id route parameter
 * - Form validation using react-hook-form with yup eventSchema
 * - Fields: title, description, eventDate, startTime, endTime, location, capacity, categoryId, status (edit only)
 * - Category dropdown dynamically fetched from categoryService.getAll()
 * - On edit: pre-populates form with existing event data from eventService.getById()
 * - On submit: calls eventService.create (new) or eventService.update (edit)
 * - Success toast notification and redirect back to /events
 * - Inline validation errors displayed below each field
 * - Loading spinner while fetching existing event or categories
 */
function EventForm() {
  // Navigation hook for redirecting after form submission
  const navigate = useNavigate();

  // Route parameter: present when editing an existing event, absent when creating
  const { id } = useParams();

  // Determine if the form is in edit mode based on the URL parameter
  const isEditMode = Boolean(id);

  // State for category options loaded from the API
  const [categories, setCategories] = useState([]);

  // Loading state for initial data fetch (categories + existing event in edit mode)
  const [loading, setLoading] = useState(true);

  // Error state for displaying fetch errors
  const [error, setError] = useState('');

  // Track form submission state to prevent double-clicks
  const [submitting, setSubmitting] = useState(false);

  // Initialize react-hook-form with yup event validation schema
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(eventSchema),
  });

  /**
   * On component mount, fetch categories and (if editing) the existing event data.
   * Categories are needed for the dropdown in both create and edit modes.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all available categories for the dropdown
        const categoryResponse = await categoryService.getAll();
        setCategories(categoryResponse.data);

        // If in edit mode, fetch the existing event and populate the form
        if (isEditMode) {
          const eventResponse = await eventService.getById(id);
          const event = eventResponse.data;
          // Reset form values to the fetched event data
          reset({
            title: event.title,
            description: event.description || '',
            eventDate: event.eventDate,
            startTime: event.startTime,
            endTime: event.endTime,
            location: event.location,
            capacity: event.capacity,
            categoryId: event.categoryId || event.category?.id,
            status: event.status,
          });
        }
      } catch (err) {
        setError('Failed to load form data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode, reset]);

  /**
   * Handle form submission: create a new event or update an existing one.
   * Displays appropriate toast notifications and redirects on success.
   */
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (isEditMode) {
        // Update the existing event with the form data
        await eventService.update(id, data);
        toast.success('Event updated successfully.');
      } else {
        // Create a new event with the form data
        await eventService.create(data);
        toast.success('Event created successfully.');
      }
      // Navigate back to the events list
      navigate('/events');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to save event. Please try again.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Display loading spinner while fetching initial data
  if (loading) return <LoadingSpinner />;

  // Display error message if data fetch failed
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page heading changes based on create vs edit mode */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit Event' : 'Create New Event'}
      </h2>

      {/* Event form card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter event title"
            />
            {errors.title && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description field (textarea) */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              {...register('description')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the event"
            />
            {errors.description && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Date and time fields in a grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Event date */}
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                Event Date *
              </label>
              <input
                id="eventDate"
                type="date"
                {...register('eventDate')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                  errors.eventDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.eventDate && (
                <p className="form-error text-red-500 text-sm mt-1">{errors.eventDate.message}</p>
              )}
            </div>

            {/* Start time */}
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <input
                id="startTime"
                type="time"
                {...register('startTime')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                  errors.startTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startTime && (
                <p className="form-error text-red-500 text-sm mt-1">{errors.startTime.message}</p>
              )}
            </div>

            {/* End time */}
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <input
                id="endTime"
                type="time"
                {...register('endTime')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                  errors.endTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endTime && (
                <p className="form-error text-red-500 text-sm mt-1">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          {/* Location field */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              id="location"
              type="text"
              {...register('location')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter event location"
            />
            {errors.location && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>

          {/* Capacity and Category in a two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Capacity field (number input) */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                Capacity *
              </label>
              <input
                id="capacity"
                type="number"
                {...register('capacity')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                  errors.capacity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Maximum attendees"
                min="1"
              />
              {errors.capacity && (
                <p className="form-error text-red-500 text-sm mt-1">{errors.capacity.message}</p>
              )}
            </div>

            {/* Category dropdown populated from API */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="categoryId"
                {...register('categoryId')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="form-error text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          {/* Status dropdown - only shown in edit mode */}
          {isEditMode && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                {...register('status')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          )}

          {/* Form action buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/events')}
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
                ? 'Update Event'
                : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;
