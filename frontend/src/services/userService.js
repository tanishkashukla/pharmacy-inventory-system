import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/users';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchUsers = () => api.get('');
export const addUser = (data) => api.post('', data);
export const updateUser = (id, data) => api.put(`/${id}`, data);
export const deleteUser = (id) => api.delete(`/${id}`);
export const searchUser = (query) => api.get(`/search?query=${query}`);

export default {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
  searchUser,
};
