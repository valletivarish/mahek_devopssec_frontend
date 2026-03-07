import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerSchema } from '../../utils/validators';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

/**
 * RegisterForm component renders the full registration page.
 * Features:
 * - Form validation using react-hook-form with yup registerSchema
 * - Fields: username, email, password, fullName with inline validation errors
 * - Calls authService.register on submit, then stores auth data via context
 * - Redirects to /dashboard on successful registration
 * - Link to the login page for existing users
 * - Styled as a centered card on a gradient background using Tailwind CSS
 */
function RegisterForm() {
  // Navigation hook for redirecting after successful registration
  const navigate = useNavigate();

  // Auth context provides the login function to store JWT token and user info
  const auth = useAuth();

  // Track form submission state to disable button and show loading indicator
  const [submitting, setSubmitting] = useState(false);

  // Initialize react-hook-form with yup validation schema for registration
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  /**
   * Handle form submission: call the register API, store auth data, redirect.
   * On success the API returns the same JWT response as login.
   */
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Send registration data to the backend API
      const response = await authService.register(data);

      // Store the returned JWT token and user info in auth context and localStorage
      auth.login(response.data);

      // Notify the user of successful registration
      toast.success('Registration successful! Welcome aboard.');

      // Navigate to the main dashboard
      navigate('/dashboard');
    } catch (error) {
      // Extract error message from API response or use a generic fallback
      const errorMsg =
        error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Full-screen gradient background centering the registration card
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header section with app branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join Event RSVP Manager</p>
        </div>

        {/* Registration form with validated fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full name input field */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              {...register('fullName')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {/* Validation error message for fullName */}
            {errors.fullName && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Username input field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Choose a username"
            />
            {/* Validation error message for username */}
            {errors.username && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Email input field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email address"
            />
            {/* Validation error message for email */}
            {errors.email && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password input field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Create a strong password"
            />
            {/* Validation error message for password */}
            {errors.password && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit button with loading state */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Link to login page for existing users */}
        <p className="text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
