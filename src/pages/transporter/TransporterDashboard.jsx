import { LayoutDashboard, Briefcase, Route, DollarSign } from 'lucide-react'
import { PageHeader, StatCard } from '../../components/ui'
import { transporterDashboard, formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

export default function TransporterDashboard() {
  const { jobs, trips } = useApp()

  // Filter transporter f1 jobs/trips (Kamanzi Transport, ID: t1)
  const myTrips = trips.filter(t => t.transporterId === 't1')
  
  const availableJobsCount = jobs.filter(j => !j.transporterId).length
  const activeTripsCount = myTrips.filter(t => t.status === 'Active' || t.status === 'In Transit').length
  const completedTripsCount = transporterDashboard.completedTrips + myTrips.filter(t => t.status === 'Completed').length
  
  const newEarnings = myTrips.filter(t => t.status === 'Completed').reduce((sum, t) => sum + t.earnings, 0)
  const totalEarningsValue = transporterDashboard.totalEarnings + newEarnings

  return (
    <div>
      <PageHeader
        title={transporterDashboard.name}
        description="Fleet management and job overview"
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Available Jobs" value={availableJobsCount} icon={Briefcase} />
        <StatCard label="Active Trips" value={activeTripsCount} icon={Route} />
        <StatCard label="Completed Trips" value={completedTripsCount} icon={LayoutDashboard} />
        <StatCard label="Total Earnings" value={formatRWF(totalEarningsValue)} icon={DollarSign} />
      </div>
    </div>
  )
}

