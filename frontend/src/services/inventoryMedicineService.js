import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/medicines';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchMedicines = () => api.get('');
export const addMedicine = (data) => api.post('', data);
export const updateMedicine = (id, data) => api.put(`/${id}`, data);
export const deleteMedicine = (id) => api.delete(`/${id}`);
export const searchMedicine = (query) => api.get(`/search?query=${query}`);

export default {
  fetchMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicine,
};
