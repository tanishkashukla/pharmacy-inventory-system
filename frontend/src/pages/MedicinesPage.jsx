import { useMemo, useState } from 'react'
import Button from '../components/Button'
import MedicineTable from '../components/MedicineTable'
import SearchBar from '../components/SearchBar'

function MedicinesPage({ medicines, setMedicines }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMedicineId, setSelectedMedicineId] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    expiryDate: '',
  })

  const filteredMedicines = useMemo(() => {
    const value = searchTerm.trim().toLowerCase()
    if (!value) return medicines

    return medicines.filter(
      (medicine) =>
        medicine.name.toLowerCase().includes(value) ||
        medicine.category.toLowerCase().includes(value),
    )
  }, [medicines, searchTerm])

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: '',
      expiryDate: '',
    })
    setSelectedMedicineId('')
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectMedicine = (medicine) => {
    setSelectedMedicineId(medicine.id)
    setFormData({
      name: medicine.name,
      category: medicine.category,
      price: String(Number(String(medicine.price).replace(/[^\d.]/g, '')) || ''),
      quantity: String(medicine.quantity),
      expiryDate: medicine.expiryDate,
    })
  }

  const handleAddMedicine = () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.quantity ||
      !formData.expiryDate
    ) {
      setStatusMessage('Please fill all fields before adding a medicine.')
      return
    }

    const newMedicine = {
      id: `MED-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: `Rs ${Number(formData.price)}`,
      quantity: Number(formData.quantity),
      expiryDate: formData.expiryDate,
    }

    setMedicines((prev) => [newMedicine, ...prev])
    resetForm()
    setStatusMessage('Medicine added successfully.')
  }

  const handleUpdateMedicine = () => {
    const fallbackByName = medicines.find(
      (medicine) => medicine.name.toLowerCase() === formData.name.trim().toLowerCase(),
    )
    const targetId = selectedMedicineId || fallbackByName?.id
    if (!targetId) {
      setStatusMessage('Select a medicine row (or use exact existing name) before updating.')
      return
    }

    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.quantity ||
      !formData.expiryDate
    ) {
      setStatusMessage('Please fill all fields before updating a medicine.')
      return
    }

    setMedicines((prev) =>
      prev.map((medicine) =>
        medicine.id === targetId
          ? {
              ...medicine,
              name: formData.name.trim(),
              category: formData.category.trim(),
              price: `Rs ${Number(formData.price)}`,
              quantity: Number(formData.quantity),
              expiryDate: formData.expiryDate,
            }
          : medicine,
      ),
    )
    resetForm()
    setStatusMessage('Medicine updated successfully.')
  }

  const handleDeleteMedicine = () => {
    if (!selectedMedicineId) {
      setStatusMessage('Select a medicine row before deleting.')
      return
    }
    setMedicines((prev) => prev.filter((medicine) => medicine.id !== selectedMedicineId))
    resetForm()
    setStatusMessage('Medicine deleted successfully.')
  }

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Medicine Details</h3>
        <form
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="Medicine Name"
          />
          <input
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="Category"
          />
          <input
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            type="number"
            min="0"
            placeholder="Price (Rs)"
          />
          <input
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            type="number"
            min="0"
            placeholder="Quantity"
          />
          <input
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            type="date"
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={handleAddMedicine}>
              Add
            </Button>
            <Button variant="secondary" onClick={handleUpdateMedicine}>
              Update
            </Button>
            <Button variant="danger" onClick={handleDeleteMedicine}>
              Delete
            </Button>
          </div>
        </form>
        <p className="mt-3 text-sm text-slate-500">
          Click a medicine row to edit/delete. {statusMessage}
        </p>
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <MedicineTable
        medicines={filteredMedicines}
        selectedId={selectedMedicineId}
        onSelectMedicine={handleSelectMedicine}
      />
    </section>
  )
}

export default MedicinesPage
