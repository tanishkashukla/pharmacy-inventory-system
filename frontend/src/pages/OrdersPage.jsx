import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../components/Button'
import orderService from '../services/orderService'

function OrdersPage({ medicines, orders, refreshMedicines }) {
  const [selectedMedicineId, setSelectedMedicineId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)

  // Sort orders by date descending (Newest first)
  const sortedOrders = [...(orders || [])].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))

  const handlePlaceOrder = async () => {
    const orderQty = Number(quantity)
    
    if (!selectedMedicineId) {
      toast.error('Please select a medicine')
      return
    }

    if (!quantity || orderQty <= 0) {
      toast.error('Please enter a valid positive quantity')
      return
    }

    const medicine = medicines.find((item) => {
       // Search both in medicine object and inside results depending on aggregate logic
       return item.id === selectedMedicineId
    })

    if (!medicine) {
      toast.error('Selected medicine not found')
      return
    }

    // Medicine quantity is aggregate infrontend if we mapped it, or we use calculated
    const medicineStock = medicine.batches?.reduce((acc, b) => acc + b.quantity, 0) || 0

    if (orderQty > medicineStock) {
      toast.error(`Insufficient stock. Available: ${medicineStock}`)
      return
    }

    setLoading(true)
    try {
      await orderService.placeOrder(selectedMedicineId, orderQty)
      toast.success(`Order placed: ${orderQty} units of ${medicine.name}`)
      
      // Auto-refresh data to sync dashboard/stock
      refreshMedicines()
      
      setQuantity('')
      setSelectedMedicineId('')
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Place New Order</h3>
        <p className="mb-6 text-sm text-slate-500">Select a medicine and specify quantity to reduce stock and generate an order entry.</p>
        
        <form className="grid gap-4 md:grid-cols-3" onSubmit={(event) => event.preventDefault()}>
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-semibold uppercase text-slate-400">Select Medicine</label>
            <select
              value={selectedMedicineId}
              onChange={(event) => setSelectedMedicineId(event.target.value)}
              disabled={loading}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">Choose item...</option>
              {medicines.map((item) => {
                const stock = item.batches?.reduce((acc, b) => acc + b.quantity, 0) || 0
                return (
                  <option key={item.id} value={item.id}>
                    {item.name} ({stock} in stock)
                  </option>
                )
              })}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-semibold uppercase text-slate-400">Order Quantity</label>
            <input
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              type="number"
              placeholder="e.g. 50"
              min="1"
              disabled={loading}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div className="flex items-end">
            <Button variant="primary" onClick={handlePlaceOrder} disabled={loading} className="w-full">
              {loading ? 'Processing...' : 'Confirm Order'}
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Medicine</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700">{order.medicineName}</td>
                  <td className="px-4 py-3 text-slate-600">{order.quantity}</td>
                  <td className="px-4 py-3 font-bold text-brand-600">Rs {order.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    {new Date(order.orderDate).toLocaleDateString()} {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
              {sortedOrders.length === 0 && (
                <tr className="border-t border-slate-100">
                  <td className="px-4 py-6 text-center text-slate-400" colSpan="4">No transactions yet.</td>
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
