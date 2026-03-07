import api from './api';

// Check-in service providing create and read operations for attendance tracking
const checkinService = {
  getAll: () => api.get('/checkins'),
  getById: (id) => api.get(`/checkins/${id}`),
  getByEvent: (eventId) => api.get(`/checkins/event/${eventId}`),
  create: (data) => api.post('/checkins', data),
  delete: (id) => api.delete(`/checkins/${id}`),
};

export default checkinService;
