function DashboardCard({ title, value, trend, type }) {
  const toneClass =
    type === 'warning'
      ? 'bg-red-50 text-red-700'
      : type === 'danger'
        ? 'bg-orange-50 text-orange-700'
        : 'bg-green-50 text-green-700'

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
      <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass}`}>
        {trend}
      </span>
    </article>
  )
}

export default DashboardCard
