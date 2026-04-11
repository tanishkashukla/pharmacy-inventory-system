function Navbar({ title }) {
  if (!title) return null
  return (
    <header className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
    </header>
  )
}

export default Navbar
