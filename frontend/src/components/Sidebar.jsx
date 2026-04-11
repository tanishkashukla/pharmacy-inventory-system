import { getNavItemsForRole } from '../config/navigation'

function Sidebar({ activePage, setActivePage, userRole }) {
  const items = getNavItemsForRole(userRole)

  return (
    <aside className="w-full border-b border-slate-200 bg-white px-4 py-4 lg:w-64 lg:min-h-screen lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
          Rx
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-800">Pharma Admin</h1>
          <p className="text-xs text-slate-500">
            {userRole === 'Buyer' ? 'Storefront' : 'Inventory Management'}
          </p>
        </div>
      </div>

      <nav
        className={`grid gap-2 ${items.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-1'}`}
      >
        {items.map((item) => {
          const active = activePage === item
          return (
            <button
              key={item}
              type="button"
              onClick={() => setActivePage(item)}
              className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700'
              }`}
            >
              {item}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
