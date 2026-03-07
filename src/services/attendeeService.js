import api from './api';

// Attendee service providing CRUD operations and name search
const attendeeService = {
  getAll: () => api.get('/attendees'),
  getById: (id) => api.get(`/attendees/${id}`),
  search: (query) => api.get(`/attendees/search?query=${encodeURIComponent(query)}`),
  create: (data) => api.post('/attendees', data),
  update: (id, data) => api.put(`/attendees/${id}`, data),
  delete: (id) => api.delete(`/attendees/${id}`),
};

export default attendeeService;
