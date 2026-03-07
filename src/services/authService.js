import api from './api';

// Authentication service handling login and registration API calls
const authService = {
  // Send login credentials and receive JWT token response
  login: (credentials) => api.post('/auth/login', credentials),

  // Send registration data and receive JWT token response
  register: (userData) => api.post('/auth/register', userData),
};

export default authService;
