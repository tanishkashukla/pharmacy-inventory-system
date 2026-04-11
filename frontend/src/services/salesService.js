import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchSales = () => api.get('/orders');

export const getStats = () => api.get('/reports/stats');

export const calculateRevenue = (sales) => {
  return sales.reduce((total, sale) => total + (sale.totalPrice || 0), 0);
};

export const getTopSellingMedicine = (sales) => {
  if (!sales.length) return 'N/A';
  const counts = {};
  sales.forEach(s => {
    counts[s.medicineName] = (counts[s.medicineName] || 0) + s.quantity;
  });
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
};

export const exportSalesCSV = (sales) => {
  const headers = ['Order ID', 'Medicine', 'Quantity', 'Amount (Rs)', 'Date'];
  const rows = sales.map(s => [
    s.id,
    s.medicineName,
    s.quantity,
    s.totalPrice.toFixed(2),
    new Date(s.orderDate).toLocaleString()
  ]);
  
  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default {
  fetchSales,
  getStats,
  calculateRevenue,
  getTopSellingMedicine,
  exportSalesCSV,
};
