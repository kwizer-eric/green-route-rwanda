import { Users, Truck, ShoppingCart, Briefcase, DollarSign, TrendingDown } from 'lucide-react'
import { PageHeader, StatCard } from '../../components/ui'
import InsightCallout from '../../components/story/InsightCallout'
import { formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

export default function AdminDashboard() {
  const { transporters, jobs, orders, listings } = useApp()

  const farmerCount = new Set(listings.map(l => l.farmerId)).size
  const buyerCount = new Set(orders.map(o => o.buyerId)).size
  const activeJobs = jobs.filter(j => j.transporterId).length
  const totalRevenue = orders.reduce((sum, o) => sum + o.total * 0.05, 0)
  const deliveredCount = listings.filter(l => ['Delivered', 'Completed'].includes(l.status)).length
  const lossReduction = deliveredCount > 0 ? Math.min(37, deliveredCount * 2.5) : 0

  return (
    <div>
      <PageHeader
        title="Platform Overview"
        description="See logistics bottlenecks before they become post-harvest loss."
      />
      <InsightCallout>
        When transport fails, farmers lose income and food spoils. This dashboard shows where supply, demand,
        and transport capacity are out of sync across Rwanda.
      </InsightCallout>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Registered Farmers" value={farmerCount} icon={Users} />
        <StatCard label="Registered Transporters" value={transporters.length} icon={Truck} />
        <StatCard label="Registered Buyers" value={buyerCount} icon={ShoppingCart} />
        <StatCard label="Active Jobs" value={activeJobs} icon={Briefcase} />
        <StatCard label="Platform Revenue" value={formatRWF(totalRevenue)} icon={DollarSign} subtext="5% commission" />
        <StatCard label="Deliveries Completed" value={deliveredCount} icon={TrendingDown} subtext={lossReduction > 0 ? `~${lossReduction.toFixed(1)}% loss avoided` : 'No deliveries yet'} />
      </div>
    </div>
  )
}
