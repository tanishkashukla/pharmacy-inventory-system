import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Button from '../components/Button'
import MedicineTable from '../components/MedicineTable'
import SearchBar from '../components/SearchBar'
import inventoryMedicineService from '../services/inventoryMedicineService'
import { MEDICINE_CATEGORIES } from '../constants/medicineCategories'

function MedicinesPage({ medicines, setMedicines, refreshMedicines }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMedicineId, setSelectedMedicineId] = useState('')
  const [medicinePicker, setMedicinePicker] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    batchNumber: '',
    category: '',
    price: '',
    quantity: '',
    expiryDate: '',
  })

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm)
    } else {
      refreshMedicines()
    }
  }, [searchTerm])

  const handleSearch = async (query) => {
    try {
      const response = await inventoryMedicineService.searchMedicine(query)
      setMedicines(response.data)
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (!formData.name || !formData.category || !formData.batchNumber) {
      toast.error('Name, Category, and Batch are required')
      return false
    }
    if (Number(formData.price) <= 0) {
      toast.error('Price must be positive')
      return false
    }
    if (Number(formData.quantity) < 0) {
      toast.error('Quantity cannot be negative')
      return false
    }
    if (new Date(formData.expiryDate) < new Date()) {
      toast.error('Expiry date cannot be in the past')
      return false
    }
    return true
  }

  const handleAddOrUpdate = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      if (selectedMedicineId) {
        await inventoryMedicineService.updateMedicine(selectedMedicineId, formData)
        toast.success('Medicine updated successfully')
      } else {
        // Check for duplicates
        const isDuplicate = medicines.some(m => m.name.toLowerCase() === formData.name.toLowerCase())
        if (isDuplicate) {
          toast.error('A medicine with this name already exists')
          setLoading(false)
          return
        }
        await inventoryMedicineService.addMedicine(formData)
        toast.success('Medicine added to inventory')
      }
      refreshMedicines()
      resetForm()
    } catch (e) {
      toast.error('Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedMedicineId) return
    if (!window.confirm('Are you sure you want to delete this medicine?')) return
    
    setLoading(true)
    try {
      await inventoryMedicineService.deleteMedicine(selectedMedicineId)
      toast.success('Medicine deleted')
      refreshMedicines()
      resetForm()
    } catch (e) {
      toast.error('Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', batchNumber: '', category: '', price: '', quantity: '', expiryDate: '' })
    setSelectedMedicineId('')
    setMedicinePicker('')
  }

  const handleSelect = (medicine) => {
    setSelectedMedicineId(medicine.id)
    setMedicinePicker('')
    setFormData({
      name: medicine.name,
      batchNumber: medicine.batches?.[0]?.batchNumber || '',
      category: medicine.category,
      price: medicine.price,
      quantity: medicine.quantity || '',
      expiryDate: medicine.batches?.[0]?.expiryDate || '',
    })
  }

  const handleMedicineDropdown = (e) => {
    const v = e.target.value
    if (v === '') {
      resetForm()
      return
    }
    if (v === '__new__') {
      setSelectedMedicineId('')
      setMedicinePicker('__new__')
      setFormData({
        name: '',
        batchNumber: '',
        category: '',
        price: '',
        quantity: '',
        expiryDate: '',
      })
      return
    }
    const med = medicines.find((m) => String(m.id) === String(v))
    if (med) handleSelect(med)
  }

  const pickerSelectValue =
    selectedMedicineId || (medicinePicker === '__new__' ? '__new__' : '')

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          {selectedMedicineId ? 'Edit Medicine' : 'Add New Medicine'}
        </h3>
        <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" onSubmit={e => e.preventDefault()}>
          <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-1">
            <label htmlFor="medicine-picker" className="text-xs font-semibold uppercase text-slate-400">
              Medicine
            </label>
            <select
              id="medicine-picker"
              value={pickerSelectValue}
              onChange={handleMedicineDropdown}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">Select medicine…</option>
              <option value="__new__">+ New medicine</option>
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            {medicinePicker === '__new__' && !selectedMedicineId && (
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Type new medicine name"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            )}
          </div>
          <input name="batchNumber" value={formData.batchNumber} onChange={handleInputChange} placeholder="Batch Number" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" disabled={!!selectedMedicineId} />
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Select category</option>
            {MEDICINE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            {formData.category && !MEDICINE_CATEGORIES.includes(formData.category) && (
              <option value={formData.category}>{formData.category} (current)</option>
            )}
          </select>
          <input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Price (Rs)" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
          <input name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} placeholder="Quantity" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" disabled={!!selectedMedicineId} />
          <input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleInputChange} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" disabled={!!selectedMedicineId} />
          <div className="flex gap-2 lg:col-span-2 lg:justify-start">
            <Button variant="primary" onClick={handleAddOrUpdate} disabled={loading}>{selectedMedicineId ? 'Update' : 'Add'}</Button>
            {selectedMedicineId && <Button variant="danger" onClick={handleDelete} disabled={loading}>Delete</Button>}
            <Button variant="outline" onClick={resetForm}>Reset</Button>
          </div>
        </form>
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      
      <MedicineTable 
        medicines={medicines} 
        selectedId={selectedMedicineId} 
        onSelectMedicine={handleSelect} 
      />
    </section>
  )
}

export default MedicinesPage
