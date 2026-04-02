import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { attendeeSchema } from '../../utils/validators';
import attendeeService from '../../services/attendeeService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

/**
 * AttendeeForm component for creating and editing attendees.
 * Features:
 * - Detects edit mode based on the presence of an :id route parameter
 * - Form validation using react-hook-form with yup attendeeSchema
 * - Fields: firstName, lastName, email, phone, organization
 * - On edit: pre-populates form with existing attendee data from attendeeService.getById()
 * - On submit: calls attendeeService.create (new) or attendeeService.update (edit)
 * - Success toast notification and redirect back to /attendees
 * - Inline validation errors displayed below each field
 */
function AttendeeForm() {
  // Navigation hook for redirecting after form submission
  const navigate = useNavigate();

  // Route parameter: present when editing, absent when creating
  const { id } = useParams();

  // Determine if the form is in edit mode
  const isEditMode = Boolean(id);

  // Loading state for initial data fetch in edit mode
  const [loading, setLoading] = useState(isEditMode);

  // Error state for displaying fetch errors
  const [error, setError] = useState('');

  // Track form submission state to prevent double-clicks
  const [submitting, setSubmitting] = useState(false);

  // Initialize react-hook-form with yup attendee validation schema
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(attendeeSchema),
  });

  /**
   * On component mount in edit mode, fetch existing attendee data
   * and populate the form fields.
   */
  useEffect(() => {
    if (isEditMode) {
      const fetchAttendee = async () => {
        try {
          const response = await attendeeService.getById(id);
          const attendee = response.data;
          // Reset form with fetched attendee data
          reset({
            firstName: attendee.firstName,
            lastName: attendee.lastName,
            email: attendee.email,
            phone: attendee.phone || '',
            organization: attendee.organization || '',
          });
        } catch (err) {
          setError('Failed to load attendee data. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchAttendee();
    }
  }, [id, isEditMode, reset]);

  /**
   * Handle form submission: create a new attendee or update an existing one.
   */
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (isEditMode) {
        await attendeeService.update(id, data);
        toast.success('Attendee updated successfully.');
      } else {
        await attendeeService.create(data);
        toast.success('Attendee created successfully.');
      }
      // Redirect back to the attendees list
      navigate('/attendees');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to save attendee. Please try again.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Display loading spinner while fetching existing data in edit mode
  if (loading) return <LoadingSpinner />;

  // Display error message if data fetch failed
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page heading changes based on create vs edit mode */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit Attendee' : 'Add New Attendee'}
      </h2>

      {/* Attendee form card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* First and Last name in a two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First name field */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                {...register('firstName')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="(First name)"
              />
              {errors.firstName && (
                <p className="form-error text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last name field */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                {...register('lastName')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="form-error text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone field (optional) */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              {...register('phone')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Organisation field (optional) */}
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
              Organisation
            </label>
            <input
              id="organization"
              type="text"
              {...register('organization')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${errors.organization ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter organisation name"
            />
            {errors.organization && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.organization.message}</p>
            )}
          </div>

          {/* Form action buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/attendees')}
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
                  ? 'Update Attendee'
                  : 'Add Attendee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AttendeeForm;
