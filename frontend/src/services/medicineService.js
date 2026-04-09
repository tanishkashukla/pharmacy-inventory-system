import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchMedicines = () => api.get('/medicines');
export const addMedicine = (data) => api.post('/medicines', data);
export const updateMedicine = (id, data) => api.put(`/medicines/${id}`, data);
export const deleteMedicine = (id) => api.delete(`/medicines/${id}`);
export const searchMedicine = (query) => api.get(`/medicines/search?query=${query}`);

export default {
  fetchMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicine
};
