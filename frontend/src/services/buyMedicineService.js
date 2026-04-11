import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMedicines = () => api.get('/medicines');

export const getBatchesByMedicine = async (medicineId) => {
  const response = await api.get('/medicines');
  const medicine = response.data.find(m => String(m.id) === String(medicineId));
  return medicine ? medicine.batches : [];
};

export const getUsers = () => api.get('/users');

export const buyMedicine = (payload) => api.post('/orders', payload);

export const getStock = async (batchId) => {
  const response = await api.get('/medicines');
  for (const med of response.data) {
    const batch = med.batches.find(b => String(b.id) === String(batchId));
    if (batch) return batch.quantity;
  }
  return 0;
};

export default {
  getMedicines,
  getBatchesByMedicine,
  getUsers,
  buyMedicine,
  getStock,
};
