import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/orders';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const placeOrder = (medicineId, quantity) => api.post('', { id: medicineId, orderQuantity: quantity });
export const fetchOrders = () => api.get('');

export default {
  placeOrder,
  fetchOrders,
};
