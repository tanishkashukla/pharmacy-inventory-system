import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../components/Button'
import orderService from '../services/orderService'

const MOCK_CUSTOMERS = [
  { id: 'walk-in', label: 'Walk-in customer' },
  { id: 'u1', label: 'Admin User' },
  { id: 'u2', label: 'Pharmacist One' },
  { id: 'u3', label: 'Inv Manager' },
]

function BuyMedicinePage({ medicines = [], refreshMedicines }) {
  const [medicineId, setMedicineId] = useState('')
  const [batchId, setBatchId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedMedicine = useMemo(
    () => medicines.find((m) => String(m.id) === String(medicineId)),
    [medicines, medicineId]
  )

  const batches = selectedMedicine?.batches ?? []

  const selectedBatch = useMemo(
    () => batches.find((b) => String(b.id ?? b.batchNumber) === String(batchId)),
    [batches, batchId]
  )

  const qtyNum = Number(quantity) || 0
  const unitPrice = selectedMedicine ? Number(selectedMedicine.price) || 0 : 0
  const lineTotal = qtyNum * unitPrice
  const totalStock =
    selectedMedicine?.batches?.reduce((acc, b) => acc + (b.quantity ?? 0), 0) ?? 0
  const stockLeft =
    selectedBatch != null
      ? Math.max(0, (selectedBatch.quantity ?? 0) - qtyNum)
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
    setCustomerId('')
  }

  const handleBuy = async () => {
    const orderQty = qtyNum

    if (!medicineId) {
      toast.error('Please select a medicine')
      return
    }
    if (!quantity || orderQty <= 0) {
      toast.error('Please enter a valid quantity')
      return
    }
    if (orderQty > totalStock) {
      toast.error(`Insufficient stock. Available: ${totalStock}`)
      return
    }

    setLoading(true)
    try {
      await orderService.placeOrder(medicineId, orderQty)
      const who = customerId ? MOCK_CUSTOMERS.find((c) => c.id === customerId)?.label : null
      toast.success(
        who
          ? `Purchase recorded: ${orderQty} × ${selectedMedicine?.name ?? 'medicine'} (${who})`
          : `Purchase recorded: ${orderQty} × ${selectedMedicine?.name ?? 'medicine'}`
      )
      await refreshMedicines?.()
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
          Records a sale using the same stock flow as Orders (FIFO across batches). Customer is for your notes only.
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
                <option value="">Any batch (FIFO)…</option>
                {batches.map((b) => {
                  const key = b.id ?? b.batchNumber
                  return (
                    <option key={key} value={key}>
                      {b.batchNumber} · Exp {b.expiryDate} · Qty {b.quantity ?? 0}
                    </option>
                  )
                })}
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

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Customer / user</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                disabled={loading}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
              >
                <option value="">Select customer…</option>
                {MOCK_CUSTOMERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="primary"
              type="button"
              className="w-full sm:w-auto"
              onClick={handleBuy}
              disabled={loading}
            >
              {loading ? 'Processing…' : 'Buy'}
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
                    {selectedBatch?.batchNumber ?? 'FIFO'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Quantity</dt>
                  <dd className="text-right font-medium text-slate-800">{qtyNum || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Customer</dt>
                  <dd className="text-right font-medium text-slate-800">
                    {MOCK_CUSTOMERS.find((c) => c.id === customerId)?.label ?? '—'}
                  </dd>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-slate-700">Amount</dt>
                    <dd className="text-lg font-bold text-brand-600">Rs {lineTotal.toFixed(2)}</dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
              <h4 className="text-sm font-semibold text-brand-900">Stock left (preview)</h4>
              <p className="mt-2 text-3xl font-bold text-brand-700">
                {stockLeft === null ? '—' : stockLeft}
              </p>
              <p className="mt-1 text-xs text-brand-800/80">
                After this quantity. Total in stock: {selectedMedicine ? totalStock : '—'}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BuyMedicinePage
