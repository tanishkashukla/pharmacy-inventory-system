export const dashboardStats = [
  { title: 'Total Medicines', value: 248, trend: '+8% this month', type: 'default' },
  { title: 'Low Stock', value: 17, trend: 'Needs restock', type: 'warning' },
  { title: 'Orders Today', value: 34, trend: '+5 from yesterday', type: 'default' },
  { title: 'Expiring Soon', value: 9, trend: 'Within 30 days', type: 'danger' },
]

export const medicines = [
  {
    id: 'MED-1001',
    name: 'Paracetamol 500mg',
    category: 'Analgesic',
    price: 'Rs 450',
    quantity: 120,
    expiryDate: '2026-12-18',
  },
  {
    id: 'MED-1002',
    name: 'Amoxicillin 250mg',
    category: 'Antibiotic',
    price: 'Rs 920',
    quantity: 18,
    expiryDate: '2026-05-10',
  },
  {
    id: 'MED-1003',
    name: 'Cetirizine 10mg',
    category: 'Antihistamine',
    price: 'Rs 680',
    quantity: 67,
    expiryDate: '2027-02-09',
  },
  {
    id: 'MED-1004',
    name: 'Insulin Glargine',
    category: 'Hormone',
    price: 'Rs 2400',
    quantity: 10,
    expiryDate: '2026-04-25',
  },
]

export const medicineOptions = medicines.map((item) => item.name)
