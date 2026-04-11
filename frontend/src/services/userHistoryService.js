import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUserHistory = (userId) => api.get(`/users/${userId}/history`);

export const getMostPurchasedMedicine = (orders) => {
  if (!orders || orders.length === 0) return '—';
  const counts = {};
  orders.forEach(o => {
    counts[o.medicineName] = (counts[o.medicineName] || 0) + o.quantity;
  });
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
};

export const getLastOrderDate = (orders) => {
  if (!orders || orders.length === 0) return null;
  const dates = orders.map(o => new Date(o.orderDate));
  return new Date(Math.max(...dates));
};

export default {
  getUserHistory,
  getMostPurchasedMedicine,
  getLastOrderDate,
};
