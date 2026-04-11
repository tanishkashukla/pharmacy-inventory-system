import { useState, useEffect } from 'react'
import DashboardCard from '../components/DashboardCard'
import salesService from '../services/salesService'
import Button from '../components/Button'

function SalesPage() {
  const [sales, setSales] = useState([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalMedicines: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [salesRes, statsRes] = await Promise.all([
        salesService.fetchSales(),
        salesService.getStats()
      ])
      const onlySales = (salesRes.data || []).filter(s => s.orderType === 'SALE')
      setSales(onlySales)
      setStats(statsRes.data)
    } catch (error) {
      console.error('Failed to fetch sales data:', error)
    } finally {
      setLoading(false)
    }
  }

  const unitsSold = sales.reduce((sum, s) => sum + s.quantity, 0)

  const cards = [
    { title: 'Total revenue', value: `Rs ${stats.totalRevenue.toFixed(2)}`, trend: 'All time', type: 'default' },
    { title: 'Medicines sold', value: unitsSold, trend: 'Units', type: 'default' },
    { title: 'Total orders', value: stats.totalOrders, trend: 'Completed', type: 'default' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <DashboardCard key={c.title} {...c} />
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Recent sales</h3>
          <Button variant="outline" size="sm" onClick={() => salesService.exportSalesCSV(sales)} disabled={sales.length === 0}>
            Export CSV
          </Button>
        </div>
        
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-100">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="whitespace-nowrap px-4 py-3">Sale ID</th>
                <th className="whitespace-nowrap px-4 py-3">Medicine</th>
                <th className="whitespace-nowrap px-4 py-3">Quantity</th>
                <th className="whitespace-nowrap px-4 py-3">Date</th>
                <th className="whitespace-nowrap px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((row) => (
                <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-600">{row.id.substring(0, 8)}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{row.medicineName}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.quantity}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {new Date(row.orderDate).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-brand-600">
                    Rs {row.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-400">No sales recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default SalesPage
