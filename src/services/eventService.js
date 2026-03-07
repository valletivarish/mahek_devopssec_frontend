import api from './api';

// Event service providing CRUD operations and search/filter endpoints
const eventService = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  getByStatus: (status) => api.get(`/events/status/${status}`),
  getByCategory: (categoryId) => api.get(`/events/category/${categoryId}`),
  search: (title) => api.get(`/events/search?title=${encodeURIComponent(title)}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

export default eventService;
