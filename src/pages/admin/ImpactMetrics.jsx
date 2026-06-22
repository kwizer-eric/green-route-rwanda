import { TrendingUp, Users, Leaf, Truck } from 'lucide-react'
import { PageHeader, Card } from '../../components/ui'
import { useApp } from '../../context/AppContext'

const icons = { trending: TrendingUp, users: Users, leaf: Leaf, truck: Truck }

export default function ImpactMetrics() {
  const { listings, trips } = useApp()

  const deliveredCount = listings.filter(l => ['Delivered', 'Completed'].includes(l.status)).length
  const completedTrips = trips.filter(t => t.status === 'Completed').length

  const dynamicImpactMetrics = [
    { label: 'Deliveries Completed', value: deliveredCount.toString(), change: deliveredCount > 0 ? 'Active on platform' : 'No deliveries yet', icon: 'trending' },
    { label: 'Trips Completed', value: completedTrips.toString(), change: completedTrips > 0 ? 'Transport coordinated' : 'Awaiting first trip', icon: 'truck' },
    { label: 'Listings Fulfilled', value: `${deliveredCount > 0 ? Math.round((deliveredCount / Math.max(listings.length, 1)) * 100) : 0}%`, change: 'Of total listings', icon: 'users' },
    { label: 'CO₂ Estimate Saved', value: `${Math.round(completedTrips * 12)} kg`, change: 'Based on trip count', icon: 'leaf' },
  ]

  return (
    <div>
      <PageHeader
        title="Impact Metrics"
        description="Measuring how coordinated logistics reduces waste, emissions, and empty trips."
      />
      <div className="grid sm:grid-cols-2 gap-4">
        {dynamicImpactMetrics.map(m => {
          const Icon = icons[m.icon]
          return (
            <Card key={m.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-500">{m.label}</p>
                  <p className="text-3xl font-semibold text-stone-900 tracking-tight mt-2">{m.value}</p>
                  <p className="text-sm text-primary font-medium mt-2">{m.change}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center">
                  <Icon size={20} className="text-primary" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      <Card className="mt-6 p-8 text-center">
        <p className="text-stone-500 text-sm max-w-lg mx-auto leading-relaxed">
          Coordinated logistics across Rwanda reduces post-harvest losses, empty return trips,
          and carbon emissions — strengthening rural-urban market connections.
        </p>
      </Card>
    </div>
  )
}
