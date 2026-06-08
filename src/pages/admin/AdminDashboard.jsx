import { Users, Truck, ShoppingCart, Briefcase, DollarSign, TrendingDown } from 'lucide-react'
import { PageHeader, StatCard } from '../../components/ui'
import InsightCallout from '../../components/story/InsightCallout'
import { platformStats, formatRWF, formatNumber } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

export default function AdminDashboard() {
  const { transporters, jobs, orders, listings } = useApp()

  const newTransporters = transporters.length - 6
  const totalTransporters = 3512 + newTransporters

  const activeJobs = jobs.filter(j => j.transporterId).length
  const totalActiveJobs = 840 + activeJobs

  const newOrdersTotal = orders
    .filter(o => !['o1', 'o2', 'o3', 'o4', 'o5'].includes(o.id))
    .reduce((sum, o) => sum + o.total, 0)
  
  // Platform receives 5% commission of new transactions
  const totalRevenue = 42850000 + (newOrdersTotal * 0.05)

  const deliveredCount = listings.filter(l => l.status === 'Delivered' || l.status === 'Completed').length
  const lossReduction = 23.4 + (deliveredCount * 0.1)

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
      <p className="text-xs text-stone-400 mb-4 -mt-2">Demo metrics — projected at scale, not live production data.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Farmers" value={formatNumber(platformStats.farmers)} icon={Users} subtext="Projected" />
        <StatCard label="Total Transporters" value={formatNumber(totalTransporters)} icon={Truck} subtext="Projected" />
        <StatCard label="Total Buyers" value={formatNumber(platformStats.buyers)} icon={ShoppingCart} subtext="Projected" />
        <StatCard label="Active Jobs Today" value={totalActiveJobs.toLocaleString()} icon={Briefcase} subtext="Demo" />
        <StatCard label="Revenue This Month" value={formatRWF(totalRevenue)} icon={DollarSign} subtext="Illustrative" />
        <StatCard label="Post-Harvest Loss Reduction" value={`${lossReduction.toFixed(1)}%`} icon={TrendingDown} subtext="Target" />
      </div>
    </div>
  )
}

