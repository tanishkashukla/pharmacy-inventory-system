/** Static preview data for user order history UI (no API). */
export function getMockUserHistory(user) {
  if (!user) {
    return {
      orders: [],
      totalOrders: 0,
      lastOrderedDate: null,
      mostPurchasedMedicine: '—',
    }
  }

  const seed = String(user.id || user.email || user.name || 'user')
  const short = seed.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'USR'
  const orders = [
    {
      id: `ORD-${short}-104`,
      medicine: 'Paracetamol 500mg',
      batch: 'B-1001',
      qty: 2,
      date: '2026-04-08',
      amount: 90,
    },
    {
      id: `ORD-${short}-089`,
      medicine: 'Amoxicillin 250mg',
      batch: 'B-1002',
      qty: 1,
      date: '2026-03-22',
      amount: 120,
    },
    {
      id: `ORD-${short}-071`,
      medicine: 'Cetirizine 10mg',
      batch: 'B-1003',
      qty: 3,
      date: '2026-02-14',
      amount: 255,
    },
  ]

  return {
    orders,
    totalOrders: orders.length,
    lastOrderedDate: orders[0]?.date ?? null,
    mostPurchasedMedicine: 'Paracetamol 500mg',
  }
}
