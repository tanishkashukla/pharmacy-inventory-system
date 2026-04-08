function Navbar({ title }) {
  return (
    <header className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500">
          Welcome back. Here is an overview of your pharmacy system.
        </p>
      </div>
      <div className="rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700">
        Admin Panel
      </div>
    </header>
  )
}

export default Navbar
