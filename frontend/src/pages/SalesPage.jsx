import DashboardCard from '../components/DashboardCard'

const MOCK_RECENT_SALES = [
  {
    saleId: 'SAL-24001',
    medicine: 'Paracetamol 500mg',
    batch: 'B-1001',
    quantity: 4,
    user: 'Walk-in',
    date: '2026-04-11T09:24:00',
    amount: 180.0,
  },
  {
    saleId: 'SAL-24002',
    medicine: 'Amoxicillin 250mg',
    batch: 'B-1002',
    quantity: 1,
    user: 'Pharmacist One',
    date: '2026-04-11T08:10:00',
    amount: 120.0,
  },
  {
    saleId: 'SAL-23988',
    medicine: 'Cetirizine 10mg',
    batch: 'B-1003',
    quantity: 2,
    user: 'Admin User',
    date: '2026-04-10T16:45:00',
    amount: 170.0,
  },
  {
    saleId: 'SAL-23970',
    medicine: 'Insulin Glargine',
    batch: 'B-1004',
    quantity: 1,
    user: 'Walk-in',
    date: '2026-04-10T11:02:00',
    amount: 1450.0,
  },
]

function SalesPage() {
  const totalSalesToday = MOCK_RECENT_SALES.reduce((sum, r) => sum + r.amount, 0)
  const totalUnits = MOCK_RECENT_SALES.reduce((sum, r) => sum + r.quantity, 0)

  const cards = [
    { title: 'Total sales today', value: `Rs ${totalSalesToday.toFixed(2)}`, trend: 'Gross total', type: 'default' },
    { title: 'Medicines sold', value: totalUnits, trend: 'Units today', type: 'default' },
    { title: 'Revenue', value: `Rs ${totalSalesToday.toFixed(2)}`, trend: 'Same-day preview', type: 'default' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <DashboardCard key={c.title} {...c} />
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-slate-800">Recent sales</h3>
        <p className="mt-1 text-sm text-slate-500">Sample rows for layout — not connected to live data.</p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-100">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="whitespace-nowrap px-4 py-3">Sale ID</th>
                <th className="whitespace-nowrap px-4 py-3">Medicine</th>
                <th className="whitespace-nowrap px-4 py-3">Batch</th>
                <th className="whitespace-nowrap px-4 py-3">Quantity</th>
                <th className="whitespace-nowrap px-4 py-3">User</th>
                <th className="whitespace-nowrap px-4 py-3">Date</th>
                <th className="whitespace-nowrap px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RECENT_SALES.map((row) => (
                <tr key={row.saleId} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-600">{row.saleId}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{row.medicine}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.batch}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.quantity}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.user}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {new Date(row.date).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-brand-600">
                    Rs {row.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default SalesPage
