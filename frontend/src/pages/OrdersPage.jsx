import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import Button from '../components/Button'
import inventoryOrderService from '../services/inventoryOrderService'

function OrdersPage({ medicines = [], orders = [], refreshMedicines }) {
  const [medicineId, setMedicineId] = useState('')
  const [batchId, setBatchId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedMedicine = useMemo(
    () => medicines.find((m) => String(m.id) === String(medicineId)),
    [medicines, medicineId]
  )

  const batches = selectedMedicine?.batches || []

  const currentStock = useMemo(
    () => inventoryOrderService.getCurrentStock(medicineId, medicines),
    [medicineId, medicines]
  )

  const stockAfter = useMemo(
    () => inventoryOrderService.getUpdatedStockPreview(medicineId, quantity, medicines),
    [medicineId, quantity, medicines]
  )

  const handlePlaceOrder = async () => {
    if (!medicineId) {
      toast.error('Please select a medicine')
      return
    }
    if (!batchId) {
      toast.error('Please select an existing batch')
      return
    }
    const qtyNum = Number(quantity)
    if (!quantity || qtyNum <= 0) {
      toast.error('Please enter a valid quantity')
      return
    }

    setLoading(true)
    try {
      await inventoryOrderService.placeInventoryOrder({
        id: medicineId,
        orderQuantity: qtyNum,
        batchId: batchId
      })
      
      toast.success(`Successfully restocked ${qtyNum} units of ${selectedMedicine.name}`)
      
      // Refresh global state
      await refreshMedicines?.()
      
      // Clear form
      setMedicineId('')
      setBatchId('')
      setQuantity('')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process restock order')
    } finally {
      setLoading(false)
    }
  }

  // Filter and Sort orders by date descending (Newest first)
  const restockOrders = useMemo(() => {
    return (orders || [])
      .filter(o => o.orderType === 'RESTOCK')
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
  }, [orders])

  return (
    <div className="space-y-6">
      {/* RESTOCK FORM SECTION (Restored from teammate's original UI) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-1 text-lg font-semibold text-slate-800">Inventory Restock</h3>
        <p className="mb-6 text-sm text-slate-500">
          Select a medicine and specify quantity to increase stock and generate an inventory replenishment record.
        </p>
        
        <form className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-slate-400">Medicine</label>
            <select
              value={medicineId}
              onChange={(e) => {
                setMedicineId(e.target.value)
                setBatchId('')
              }}
              disabled={loading}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">Choose item...</option>
              {medicines.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-slate-400">Existing Batch</label>
            <select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              disabled={loading || !medicineId}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
              <option value="">Select batch...</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.batchNumber} (Current: {b.quantity})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-slate-400">Restock Quantity</label>
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              placeholder="e.g. 50"
              min="1"
              disabled={loading}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {medicineId && (
            <div className="col-span-full grid grid-cols-2 gap-4 rounded-xl bg-brand-50/50 p-4 border border-brand-100">
              <div className="text-center">
                <span className="block text-xs font-bold uppercase text-brand-600">Current Total Stock</span>
                <span className="text-2xl font-bold text-brand-900">{currentStock}</span>
              </div>
              <div className="text-center border-l border-brand-200">
                <span className="block text-xs font-bold uppercase text-brand-600">Stock After Restock</span>
                <span className="text-2xl font-bold text-brand-700">{stockAfter}</span>
              </div>
            </div>
          )}

          <div className="col-span-full flex items-end pt-2">
            <Button variant="primary" onClick={handlePlaceOrder} disabled={loading} className="w-full sm:w-auto min-w-[160px]">
              {loading ? 'Processing...' : 'Complete Restock'}
            </Button>
          </div>
        </form>
      </section>

      {/* HISTORY TABLE SECTION */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Restock History</h3>
          <span className="text-sm font-medium text-slate-500">{restockOrders.length} Replenishment entries</span>
        </div>
        
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-bold">Transaction</th>
                <th className="px-4 py-3 font-bold">Medicine</th>
                <th className="px-4 py-3 font-bold">Qty Added</th>
                <th className="px-4 py-3 text-right font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {restockOrders.map((order) => (
                <tr key={order.id} className="border-t border-slate-100 transition hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-400 text-[10px] tabular-nums uppercase">#{order.id.slice(0,8)}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{order.medicineName}</td>
                  <td className={`px-4 py-3 font-bold text-green-600`}>
                    +{order.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500 tabular-nums">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {restockOrders.length === 0 && (
                <tr className="border-t border-slate-100">
                  <td className="px-4 py-12 text-center text-slate-400" colSpan="4">No replenishment records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default OrdersPage
