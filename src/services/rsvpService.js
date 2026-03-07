import api from './api';

// RSVP service providing CRUD operations and event/attendee filtering
const rsvpService = {
  getAll: () => api.get('/rsvps'),
  getById: (id) => api.get(`/rsvps/${id}`),
  getByEvent: (eventId) => api.get(`/rsvps/event/${eventId}`),
  getByAttendee: (attendeeId) => api.get(`/rsvps/attendee/${attendeeId}`),
  create: (data) => api.post('/rsvps', data),
  update: (id, data) => api.put(`/rsvps/${id}`, data),
  delete: (id) => api.delete(`/rsvps/${id}`),
};

export default rsvpService;
