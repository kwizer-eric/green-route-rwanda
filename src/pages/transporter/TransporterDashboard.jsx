import { LayoutDashboard, Briefcase, Route, DollarSign } from 'lucide-react'
import { PageHeader, StatCard } from '../../components/ui'
import InsightCallout from '../../components/story/InsightCallout'
import { formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { usePortalIdentity } from '../../context/AuthContext'

export default function TransporterDashboard() {
  const { jobs, trips } = useApp()
  const { entityId: transporterId, fullName } = usePortalIdentity()

  const myTrips = trips.filter(t => t.transporterId === transporterId)
  const availableJobsCount = jobs.filter(j => !j.transporterId).length
  const activeTripsCount = myTrips.filter(t => ['Active', 'In Transit'].includes(t.status)).length
  const completedTripsCount = myTrips.filter(t => t.status === 'Completed').length
  const totalEarningsValue = myTrips
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.earnings, 0)

  return (
    <div>
      <PageHeader
        title={`Welcome, ${fullName || 'Transporter'}`}
        description="Fill your truck, cut empty return trips, earn from coordinated loads."
      />
      <InsightCallout>
        Empty return trips waste fuel and income. GreenRoute Rwanda sends you coordinated loads on routes you already serve —
        fewer wasted kilometers, better utilization.
      </InsightCallout>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Available Jobs" value={availableJobsCount} icon={Briefcase} />
        <StatCard label="Active Trips" value={activeTripsCount} icon={Route} />
        <StatCard label="Completed Trips" value={completedTripsCount} icon={LayoutDashboard} />
        <StatCard label="Total Earnings" value={formatRWF(totalEarningsValue)} icon={DollarSign} />
      </div>
    </div>
  )
}
