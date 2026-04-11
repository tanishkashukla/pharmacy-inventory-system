import { useMemo, useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import MedicinesPage from './pages/MedicinesPage'
import OrdersPage from './pages/OrdersPage'
import ReportsPage from './pages/ReportsPage'
import UsersPage from './pages/UsersPage'
import BuyMedicinePage from './pages/BuyMedicinePage'
import SalesPage from './pages/SalesPage'
import LoginPage from './pages/LoginPage'

import inventoryMedicineService from './services/inventoryMedicineService'
import orderService from './services/orderService'
import reportService from './services/reportService'
import { isPageAllowedForRole } from './config/navigation'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [activePage, setActivePage] = useState('Dashboard')
  const [medicines, setMedicines] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStockCount: 0,
    totalOrders: 0,
    totalRevenue: 0,
    expiringSoon: 0
  })

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData()
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (!isLoggedIn || !userRole) return
    if (!isPageAllowedForRole(userRole, activePage)) {
      setActivePage(userRole === 'Buyer' ? 'Buy Medicine' : 'Dashboard')
    }
  }, [isLoggedIn, userRole, activePage])

  const fetchAllData = async () => {
    try {
      const [medRes, orderRes, statRes] = await Promise.all([
        inventoryMedicineService.fetchMedicines(),
        orderService.fetchOrders(),
        reportService.fetchStats()
      ])
      setMedicines(medRes.data)
      setOrders(orderRes.data)
      setStats(statRes.data)
    } catch (error) {
      console.error('Data sync failed:', error)
    }
  }

  const handleLogin = (role) => {
    setUserRole(role)
    setActivePage(role === 'Buyer' ? 'Buy Medicine' : 'Dashboard')
    setIsLoggedIn(true)
  }

  const pageContent = useMemo(() => {
    if (userRole === 'Buyer') {
      return <BuyMedicinePage medicines={medicines} refreshMedicines={fetchAllData} />
    }

    switch (activePage) {
      case 'Medicines':
        return <MedicinesPage medicines={medicines} setMedicines={setMedicines} refreshMedicines={fetchAllData} />
      case 'Orders':
        return <OrdersPage medicines={medicines} orders={orders} refreshMedicines={fetchAllData} />
      case 'Buy Medicine':
        return <BuyMedicinePage medicines={medicines} refreshMedicines={fetchAllData} />
      case 'Sales':
        return <SalesPage />
      case 'Reports':
        return <ReportsPage medicines={medicines} stats={stats} orders={orders} />
      case 'Users':
        return <UsersPage />
      case 'Dashboard':
      default:
        // Adapt dashboard stats format
        const dashStats = [
          { title: 'Total Medicines', value: stats.totalMedicines, trend: 'In inventory', type: 'default' },
          { title: 'Low Stock', value: stats.lowStockCount, trend: 'Needs attention', type: 'warning' },
          { title: 'Total Orders', value: stats.totalOrders, trend: 'Processed', type: 'default' },
          { title: 'Expiring Soon', value: stats.expiringSoon, trend: 'Next 30 days', type: 'danger' },
          { title: 'Total Revenue', value: `Rs ${stats.totalRevenue.toFixed(2)}`, trend: 'Gross total', type: 'default' },
        ]
        return <DashboardPage stats={dashStats} />
    }
  }, [activePage, medicines, stats, orders, userRole])

  if (!isLoggedIn) {
    return (
      <>
        <Toaster position="top-right" />
        <LoginPage onLogin={handleLogin} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Toaster position="top-right" />
      <Sidebar activePage={activePage} setActivePage={setActivePage} userRole={userRole} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-4 flex items-center justify-between">
          <Navbar title={userRole === 'Buyer' ? 'Buy Medicine' : activePage} />
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase text-slate-400">View as:</span>
            <span className="rounded-lg bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">{userRole}</span>
            <button onClick={() => setIsLoggedIn(false)} className="text-xs text-slate-400 hover:text-red-500">Logout</button>
          </div>
        </div>
        {pageContent}
      </main>
    </div>
  )
}

export default App
