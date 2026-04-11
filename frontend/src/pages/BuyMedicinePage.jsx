import { useMemo, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Button from '../components/Button'
import buyMedicineService from '../services/buyMedicineService'
import userHistoryService from '../services/userHistoryService'

function BuyMedicinePage({ medicines = [], refreshMedicines, currentUser }) {
  const [medicineId, setMedicineId] = useState('')
  const [batchId, setBatchId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [customerId, setCustomerId] = useState(currentUser?.id || '')
  const [customers, setCustomers] = useState([])
  const [personalHistory, setPersonalHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const isBuyer = currentUser?.role === 'Buyer'

  useEffect(() => {
    fetchCustomers()
    if (currentUser?.id) {
      fetchPersonalHistory()
    }
  }, [currentUser])

  const fetchCustomers = async () => {
    try {
      const response = await buyMedicineService.getUsers()
      setCustomers(response.data)
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    }
  }

  const fetchPersonalHistory = async () => {
    try {
      const response = await userHistoryService.getUserHistory(currentUser.id)
      setPersonalHistory(response.data)
    } catch (error) {
      console.error('Failed to fetch personal history:', error)
    }
  }

  const selectedMedicine = useMemo(
    () => medicines.find((m) => String(m.id) === String(medicineId)),
    [medicines, medicineId]
  )

  const batches = selectedMedicine?.batches ?? []

  const selectedBatch = useMemo(
    () => batches.find((b) => String(b.id) === String(batchId)),
    [batches, batchId]
  )

  const qtyNum = Number(quantity) || 0
  const unitPrice = selectedMedicine ? Number(selectedMedicine.price) || 0 : 0
  const lineTotal = qtyNum * unitPrice
  
  const totalStock =
    selectedMedicine?.batches?.reduce((acc, b) => acc + (b.quantity ?? 0), 0) ?? 0

  const batchStock = selectedBatch?.quantity ?? 0

  const stockLeft =
    selectedBatch != null
      ? Math.max(0, batchStock - qtyNum)
      : selectedMedicine
        ? Math.max(0, totalStock - qtyNum)
        : null

  const handleMedicineChange = (id) => {
    setMedicineId(id)
    setBatchId('')
    setQuantity('')
  }

  const resetAfterBuy = () => {
    setMedicineId('')
    setBatchId('')
    setQuantity('')
    if (!isBuyer) setCustomerId('')
  }

  const handleBuy = async () => {
    if (!medicineId) {
      toast.error('Please select a medicine')
      return
    }
    if (!batchId) {
      toast.error('Please select a specific batch')
      return
    }
    if (!quantity || qtyNum <= 0) {
      toast.error('Please enter a valid quantity')
      return
    }
    if (qtyNum > batchStock) {
      toast.error(`Insufficient stock in selected batch. Available: ${batchStock}`)
      return
    }
    if (!customerId) {
      toast.error('Please select a customer')
      return
    }

    setLoading(true)
    try {
      await buyMedicineService.buyMedicine({
        id: medicineId,
        orderQuantity: qtyNum,
        batchId: batchId,
        customerId: customerId
      })
      
      toast.success(`Purchase recorded: ${qtyNum} × ${selectedMedicine?.name ?? 'medicine'}`)
      
      await refreshMedicines?.()
      if (currentUser?.id) fetchPersonalHistory()
      resetAfterBuy()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not complete purchase')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-slate-800">Buy medicine</h3>
        <p className="mt-1 text-sm text-slate-500">
          {isBuyer ? 'Place your order below. Your stock will be updated instantly.' : 'Record a sale manually for a customer.'}
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Medicine</label>
              <select
                value={medicineId}
                onChange={(e) => handleMedicineChange(e.target.value)}
                disabled={loading}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
              >
                <option value="">Select medicine…</option>
                {medicines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Batch (reference)</label>
              <select
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                disabled={!selectedMedicine || loading}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="">Select specific batch…</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.batchNumber} · Exp {b.expiryDate} · Qty {b.quantity ?? 0}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Quantity</label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={loading}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
              />
            </div>

            {!isBuyer && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase text-slate-400">Customer / user</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  disabled={loading}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
                >
                  <option value="">Select customer…</option>
                  <option value="walk-in">Walk-in customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              variant="primary"
              type="button"
              className="w-full sm:w-auto"
              onClick={handleBuy}
              disabled={loading}
            >
              {loading ? 'Processing…' : 'Buy Now'}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
              <h4 className="text-sm font-semibold text-slate-800">Order summary</h4>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Medicine</dt>
                  <dd className="text-right font-medium text-slate-800">
                    {selectedMedicine?.name ?? '—'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Batch</dt>
                  <dd className="text-right font-medium text-slate-800">
                    {selectedBatch?.batchNumber ?? '—'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Quantity</dt>
                  <dd className="text-right font-medium text-slate-800">{qtyNum || '—'}</dd>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-slate-700">Total Amount</dt>
                    <dd className="text-lg font-bold text-brand-600">Rs {lineTotal.toFixed(2)}</dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
              <h4 className="text-sm font-semibold text-brand-900">After Purchase Stock Left</h4>
              <p className="mt-2 text-3xl font-bold text-brand-700">
                {stockLeft === null ? '—' : stockLeft}
              </p>
              <p className="mt-1 text-xs text-brand-800/80">
                {selectedBatch ? `Batch stock after: ${stockLeft}` : `Total stock after: ${stockLeft}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {isBuyer && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-semibold text-slate-800">Your Recent Orders</h3>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-100">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Medicine</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {personalHistory.map((order) => (
                  <tr key={order.id} className="border-t border-slate-100 font-medium">
                    <td className="px-4 py-3 text-slate-800">{order.medicineName}</td>
                    <td className="px-4 py-3 text-slate-600">{order.quantity}</td>
                    <td className="px-4 py-3 text-slate-500">{new Date(order.orderDate).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-brand-600">Rs {order.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
                {!personalHistory.length && (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-slate-400">You haven't placed any orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

export default BuyMedicinePage
