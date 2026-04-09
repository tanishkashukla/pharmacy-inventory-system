import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/reports';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchStats = () => api.get('/stats');

export default {
  fetchStats,
};
