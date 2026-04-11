import axios from 'axios'

const API_BASE_URL = 'http://localhost:8081/api'

const inventoryOrderService = {
  getMedicines: async () => {
    return axios.get(`${API_BASE_URL}/medicines`)
  },

  placeInventoryOrder: async (payload) => {
    // payload: { id (medId), orderQuantity, batchId, orderType: 'RESTOCK' }
    return axios.post(`${API_BASE_URL}/orders`, {
      ...payload,
      orderType: 'RESTOCK'
    })
  },

  getCurrentStock: (medicineId, medicines) => {
    const med = medicines.find(m => String(m.id) === String(medicineId))
    if (!med) return 0
    return med.batches?.reduce((acc, b) => acc + (b.quantity || 0), 0) || 0
  },

  getUpdatedStockPreview: (medicineId, quantity, medicines) => {
    const current = inventoryOrderService.getCurrentStock(medicineId, medicines)
    return current + (Number(quantity) || 0)
  }
}

export default inventoryOrderService
