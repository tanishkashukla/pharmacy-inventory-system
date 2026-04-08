import DashboardCard from '../components/DashboardCard'

function DashboardPage({ stats }) {
  return (
    <section className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  )
}

export default DashboardPage
