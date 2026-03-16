import * as yup from 'yup';

// Validation schema for event creation/editing forms
// Matches backend Jakarta validation constraints
export const eventSchema = yup.object().shape({
  title: yup.string().required('Event title is required').max(200, 'Title must not exceed 200 characters'),
  description: yup.string().max(2000, 'Description must not exceed 2000 characters'),
  eventDate: yup.string().required('Event date is required'),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
  location: yup.string().required('Location is required').max(500, 'Location must not exceed 500 characters'),
  capacity: yup.number().typeError('Capacity is required').required('Capacity is required').min(1, 'Capacity must be at least 1').max(10000, 'Capacity must not exceed 10000').integer('Capacity must be a whole number'),
  categoryId: yup.number().typeError('Category is required').required('Category is required'),
});

// Validation schema for attendee creation/editing forms
export const attendeeSchema = yup.object().shape({
  firstName: yup.string().required('First name is required').max(100, 'First name must not exceed 100 characters'),
  lastName: yup.string().required('Last name is required').max(100, 'Last name must not exceed 100 characters'),
  email: yup.string().required('Email is required').email('Must be a valid email address').max(150, 'Email must not exceed 150 characters'),
  phone: yup.string().max(20, 'Phone must not exceed 20 characters'),
  organization: yup.string().max(200, 'Organisation must not exceed 200 characters'),
});

// Validation schema for category creation/editing forms
export const categorySchema = yup.object().shape({
  name: yup.string().required('Category name is required').max(100, 'Name must not exceed 100 characters'),
  description: yup.string().max(500, 'Description must not exceed 500 characters'),
  colorCode: yup.string().matches(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex colour (e.g., #FF5733)').nullable(),
});

// Validation schema for RSVP creation/editing forms
export const rsvpSchema = yup.object().shape({
  eventId: yup.number().typeError('Event is required').required('Event is required'),
  attendeeId: yup.number().typeError('Attendee is required').required('Attendee is required'),
  status: yup.string().required('RSVP status is required').oneOf(['CONFIRMED', 'DECLINED', 'MAYBE', 'WAITLISTED'], 'Invalid RSVP status'),
  dietaryPreferences: yup.string().max(500, 'Dietary preferences must not exceed 500 characters'),
  specialRequirements: yup.string().max(500, 'Special requirements must not exceed 500 characters'),
});

// Validation schema for check-in creation forms
export const checkinSchema = yup.object().shape({
  eventId: yup.number().typeError('Event is required').required('Event is required'),
  attendeeId: yup.number().typeError('Attendee is required').required('Attendee is required'),
  checkInMethod: yup.string().required('Check-in method is required').oneOf(['QR_CODE', 'MANUAL'], 'Invalid check-in method'),
  notes: yup.string().max(500, 'Notes must not exceed 500 characters'),
});

// Validation schema for user login form
export const loginSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

// Validation schema for user registration form
export const registerSchema = yup.object().shape({
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters').max(50, 'Username must not exceed 50 characters'),
  email: yup.string().required('Email is required').email('Must be a valid email address'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters').max(100, 'Password must not exceed 100 characters'),
  fullName: yup.string().required('Full name is required').max(100, 'Full name must not exceed 100 characters'),
});
