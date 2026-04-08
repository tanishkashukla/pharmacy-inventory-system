import { useState } from 'react'
import Button from '../components/Button'

function OrdersPage({ medicines, setMedicines }) {
  const [selectedMedicine, setSelectedMedicine] = useState('')
  const [quantity, setQuantity] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const handlePlaceOrder = () => {
    const orderQty = Number(quantity)
    if (!selectedMedicine) {
      setStatusMessage('Please select a medicine.')
      return
    }

    if (!orderQty || orderQty <= 0) {
      setStatusMessage('Please enter a valid quantity.')
      return
    }

    const medicine = medicines.find((item) => item.name === selectedMedicine)
    if (!medicine) {
      setStatusMessage('Selected medicine not found.')
      return
    }

    if (orderQty > medicine.quantity) {
      setStatusMessage(`Insufficient stock. Available: ${medicine.quantity}`)
      return
    }

    setMedicines((prev) =>
      prev.map((item) =>
        item.id === medicine.id ? { ...item, quantity: item.quantity - orderQty } : item,
      ),
    )
    setStatusMessage(`Order placed for ${orderQty} units of ${selectedMedicine}.`)
    setQuantity('')
    setSelectedMedicine('')
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">Place New Order</h3>
      <form className="grid gap-4 md:grid-cols-3" onSubmit={(event) => event.preventDefault()}>
        <select
          value={selectedMedicine}
          onChange={(event) => setSelectedMedicine(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          <option value="">Select Medicine</option>
          {medicines.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          type="number"
          placeholder="Quantity"
          min="1"
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <div>
          <Button variant="primary" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </div>
      </form>
      <p className="mt-3 text-sm text-slate-500">{statusMessage}</p>
    </section>
  )
}

export default OrdersPage
