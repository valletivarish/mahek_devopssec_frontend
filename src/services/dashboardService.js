import api from './api';

// Dashboard service fetching aggregated statistics for the overview page
const dashboardService = {
  getDashboardData: () => api.get('/dashboard'),
};

export default dashboardService;
