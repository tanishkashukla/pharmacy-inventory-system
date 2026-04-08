import { useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import MedicinesPage from './pages/MedicinesPage'
import OrdersPage from './pages/OrdersPage'
import { dashboardStats, medicines as initialMedicines } from './data/dummyData'

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [medicines, setMedicines] = useState(initialMedicines)

  const pageContent = useMemo(() => {
    if (activePage === 'Medicines') {
      return <MedicinesPage medicines={medicines} setMedicines={setMedicines} />
    }

    if (activePage === 'Orders') {
      return <OrdersPage medicines={medicines} setMedicines={setMedicines} />
    }

    if (activePage === 'Dashboard') {
      return <DashboardPage stats={dashboardStats} />
    }

    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
        {activePage} page UI placeholder.
      </section>
    )
  }, [activePage, medicines])

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Navbar title={activePage} />
        {pageContent}
      </main>
    </div>
  )
}

export default App
