import { useMemo } from 'react'
import Button from '../components/Button'

function ReportsPage({ medicines, stats, orders }) {
  const lowStockMedicines = useMemo(() => {
    return medicines
      .map(m => ({
        ...m,
        totalQuantity: m.batches?.reduce((acc, b) => acc + b.quantity, 0) || 0
      }))
      .filter((m) => m.totalQuantity <= 20)
  }, [medicines])

  const expiryAlerts = useMemo(() => {
    const today = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)

    return medicines
      .map(m => {
        const earliest = m.batches?.reduce((prev, curr) => {
           return (new Date(curr.expiryDate) < new Date(prev.expiryDate)) ? curr : prev;
        }, m.batches[0])
        return { ...m, closestExpiry: earliest?.expiryDate }
      })
      .filter((m) => {
        if (!m.closestExpiry) return false
        const expiry = new Date(m.closestExpiry)
        return expiry <= thirtyDaysFromNow && expiry >= today
      })
  }, [medicines])

  const calculateDaysLeft = (dateString) => {
    if (!dateString) return 0
    const diff = new Date(dateString) - new Date()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return isNaN(days) ? 0 : days
  }

  const exportToCSV = () => {
    const headers = ['Medicine Name', 'Category', 'Quantity', 'Price']
    const rows = medicines.map(m => [m.name, m.category, m.quantity, m.price])
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pharmacy_inventory_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Inventory Analysis Reports</h2>
        <Button variant="primary" onClick={exportToCSV}>Export CSV Report</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-red-600">Low Stock Alert (Critical)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Medicine</th>
                  <th className="px-4 py-3 text-center">Current Stock</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockMedicines.map(m => (
                  <tr key={m.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-700">{m.name}</td>
                    <td className="px-4 py-3 text-center text-slate-600">{m.totalQuantity}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">Refill Needed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {lowStockMedicines.length === 0 && <p className="py-4 text-center text-slate-500">All stock levels healthy.</p>}
          </div>
        </div>

        {/* Expiry Alert Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-amber-600">Expiry Watchlist (Next 30 Days)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Medicine</th>
                  <th className="px-4 py-3">Expiry</th>
                  <th className="px-4 py-3 text-right">Days Left</th>
                </tr>
              </thead>
              <tbody>
                {expiryAlerts.map(m => (
                  <tr key={m.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-700">{m.name}</td>
                    <td className="px-4 py-3 text-slate-600">{m.closestExpiry}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-amber-700">{calculateDaysLeft(m.closestExpiry)} d</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {expiryAlerts.length === 0 && <p className="py-4 text-center text-slate-500">No immediate expiries detected.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
