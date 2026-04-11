import { getMockUserHistory } from '../data/userHistoryMock'

function UserHistoryDrawer({ user, onClose }) {
  if (!user) return null

  const { orders, totalOrders, lastOrderedDate, mostPurchasedMedicine } = getMockUserHistory(user)

  return (
    <>
      <button
        type="button"
        aria-label="Close panel"
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />
      <aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-history-title"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id="user-history-title" className="text-lg font-semibold text-slate-800">
              Order history
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Total orders</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{totalOrders}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Last ordered</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {lastOrderedDate ? new Date(lastOrderedDate).toLocaleDateString() : '—'}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:col-span-1">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Top medicine</p>
            <p className="mt-1 line-clamp-2 text-sm font-semibold text-brand-700">{mostPurchasedMedicine}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Timeline</p>
          <ol className="relative space-y-0 border-l-2 border-brand-100 pl-5">
            {orders.map((order, index) => (
              <li key={order.id} className="relative pb-6 last:pb-0">
                <span
                  className={`absolute -left-[1.125rem] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white ${
                    index === 0 ? 'bg-brand-600' : 'bg-brand-300'
                  }`}
                />
                <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">{order.medicine}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Batch {order.batch} · Qty {order.qty}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700">
                      Rs {order.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span className="font-mono text-slate-600">{order.id}</span>
                    <span>{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                </article>
              </li>
            ))}
          </ol>
          {orders.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-400">
              No orders to display.
            </p>
          )}
        </div>
      </aside>
    </>
  )
}

export default UserHistoryDrawer
