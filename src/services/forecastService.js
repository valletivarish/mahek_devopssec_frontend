import api from './api';

// Forecast service fetching attendance predictions from the ML endpoint
const forecastService = {
  getForecast: () => api.get('/forecast'),
};

export default forecastService;
