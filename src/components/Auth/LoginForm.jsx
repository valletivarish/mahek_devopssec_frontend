import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginSchema } from '../../utils/validators';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

/**
 * LoginForm component renders the full login page.
 * Features:
 * - Form validation using react-hook-form with yup loginSchema
 * - Username and password fields with inline validation errors
 * - Calls authService.login on submit, then stores auth data via context
 * - Redirects to /dashboard on successful login
 * - Link to the registration page for new users
 * - Styled as a centered card on a gradient background using Tailwind CSS
 */
function LoginForm() {
  // Navigation hook for redirecting after successful login
  const navigate = useNavigate();

  // Auth context provides the login function to store JWT token and user info
  const auth = useAuth();

  // Track form submission state to disable button and show loading indicator
  const [submitting, setSubmitting] = useState(false);

  // Initialize react-hook-form with yup validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  /**
   * Handle form submission: call the login API, store auth data, redirect.
   * Displays toast notifications for success or failure.
   */
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Send login credentials to the backend API
      const response = await authService.login(data);

      // Store the returned JWT token and user info in auth context and localStorage
      auth.login(response.data);

      // Notify the user of successful login
      toast.success('Login successful! Welcome back.');

      // Navigate to the main dashboard
      navigate('/dashboard');
    } catch (error) {
      // Extract error message from API response or use a generic fallback
      const errorMsg =
        error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Full-screen gradient background centering the login card
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header section with app branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to Event RSVP Manager</p>
        </div>

        {/* Login form with validated fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              placeholder="Enter your username"
            />
            {/* Validation error message for username */}
            {errors.username && (
              <p className="form-error text-red-500 text-sm mt-1">{errors.username.message}</p>
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
              placeholder="Enter your password"
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
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Link to registration page for new users */}
        <p className="text-center text-gray-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
